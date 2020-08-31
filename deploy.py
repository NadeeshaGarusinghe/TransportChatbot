from flask import Flask, request, jsonify
from mysql.connector import MySQLConnection, Error
import numpy as np
import datetime
import pymysql
import mysql.connector
import re
import pickle
from nltk.corpus import stopwords
from flask_cors import CORS
import nltk
from xgboost import XGBClassifier
import os
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

REPLACE_BY_SPACE_RE = re.compile('[/(){}\[\]\|@,;]')
BAD_SYMBOLS_RE = re.compile('[^0-9a-z #+_]')
STOPWORDS = set(stopwords.words('english'))


def text_prepare(text):
    """
        text: a string

        return: modified initial string
    """
    text = text.lower()  # lowercase text
    # replace REPLACE_BY_SPACE_RE symbols by space in text
    text = re.sub(REPLACE_BY_SPACE_RE, " ", text)
    # delete symbols which are in BAD_SYMBOLS_RE from text
    text = re.sub(BAD_SYMBOLS_RE, "", text)
    text = " " + text + " "
    for sw in STOPWORDS:
        text = text.replace(" "+sw+" ", " ")  # delete stopwords from text
    text = re.sub('[ ][ ]+', " ", text)
    if len(text) > 1:
        if text[0] == ' ':
            text = text[1:]
        if text[-1] == ' ':
            text = text[:-1]

    return text


vectorizer = pickle.load(open("vectorizer.pk", "rb"))
model = XGBClassifier()
model.load_model("xgboost_model.json")

databasehost = os.environ.get('databasehost')
database = os.environ.get('database')
databaseuser = os.environ.get('databaseuser')
databasepassword = os.environ.get('databasepassword')


def getLocation(sent):

    def extract_entity_names(t):
        entity_names = []

        if (hasattr(t, 'label') and t.label):
            if t.label() == "NE":
                entity_names.append(''.join([child[0] for child in t]))
            else:
                for child in t:
                    entity_names.extend(extract_entity_names(child))

        return entity_names

    sentences = nltk.sent_tokenize(sent)
    tokenized_sent = [nltk.word_tokenize(sentence) for sentence in sentences]
    tagged_sentences = [nltk.pos_tag(sentence) for sentence in tokenized_sent]
    chunked_sentences = nltk.ne_chunk_sents(tagged_sentences, binary=True)

    entities = []
    for tree in chunked_sentences:
        entities.extend(extract_entity_names(tree))

    return entities

# get bus fees details


def getBusFeesDetail(origin, destination):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)

        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "SELECT * FROM bus_fees WHERE origin=%s and destination=%s"
        location = (origin, destination)
        cursor.execute(sql_select_query, location)
        data = cursor.fetchone()
        if data is None:
            location = (destination, origin)
            cursor.execute(sql_select_query, location)
            data = cursor.fetchone()

    except mysql.connector.Error as error:
        result = ("Failed to get record from MySQL table: {}".format(error))

    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

    if data is None:
        result = "sorry!please enter a valid origin and destination:("
    else:
        result = ""

        result = result+"From: "+data[1] + " "
        result = result+"To: "+data[2]+" "
        result = result+"\nNormal bus fees is Rs: "+data[3]+" "

        if (data[4] != '--'):
            result = result+'\nsemi luxary bus fees is Rs: '
            result = result + data[4]+" "

        if (data[5] != '--'):
            result = result+"\nair conditioned bus fees is Rs: "
            result = result+data[5]+" "
    return result


# get train fees details
def getTrainFeesDetail(origin_station, destination_station):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)

        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "SELECT * FROM train_fees WHERE origin_station=%s and destination_station=%s"
        location = (origin_station, destination_station)
        cursor.execute(sql_select_query, location)
        data = cursor.fetchone()
        if data is None:
            location = (destination_station, origin_station)
            cursor.execute(sql_select_query, location)
            data = cursor.fetchone()
    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))

    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

    if data is None:
        result = "sorry!please enter a valid origin and destination:("
    else:
        result = ""

        result = result+"From: "+data[1] + " "
        result = result+"To: "+data[2]+" "
        result = result+"on track number "+data[0]+",    "
        result = result+"\n1st class price is Rs: "+data[3]+"    "
        result = result+"\n2nd class price is Rs: "+data[4]+"    "
        result = result+"\n3rd class price is Rs: "+data[5]+" "
    return result

# get distance from bus


def getDistanceByBus(origin, destination):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)
        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "SELECT * FROM distance_by_bus WHERE origin=%s and destination=%s"
        location = (origin, destination)
        cursor.execute(sql_select_query, location)
        data = cursor.fetchone()
        if data is None:
            location = (destination, origin)
            cursor.execute(sql_select_query, location)
            data = cursor.fetchone()

    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))

    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

    if data is None:
        result = "sorry!please enter a valid origin and destination:("
    else:
        result = ""

        result = result+"From: "+data[0] + " "
        result = result+"To: "+data[1]+" "
        result = result+"the distance from bus is " + \
            data[2]+" and run time is "+data[3]
    return result

# get distance by train


def getDistanceByTrain(origin, destination):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)
        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "SELECT * FROM distance_by_train WHERE origin_station=%s and destination_station=%s"
        location = (origin, destination)
        cursor.execute(sql_select_query, location)
        data = cursor.fetchone()
        if data is None:
            location = (destination, origin)
            cursor.execute(sql_select_query, location)
            data = cursor.fetchone()
    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))

    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

    if data is None:
        result = "sorry!please enter a valid origin and destination:("
    else:
        result = ""

        result = result+"From: "+origin + "  "
        result = result+"To: "+destination+"  "
        result = result+"the distance from train is " + \
            data[3]+"km  "+" on the track  "+data[1]
    return result


# getbustimes
def getBusTimeDetail(origin, destination):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)

        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "SELECT * FROM bus_times WHERE origin=%s and destination=%s"
        location = (origin, destination)
        cursor.execute(sql_select_query, location)
        rows = cursor.fetchall()

    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))

    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")
    if len(rows) == 0:
        result = "sorry!please enter a valid origin and destination:("
        return result
    else:
        result1 = []
        allData = []
        for row in rows:
            allData.append(row)
            now = datetime.datetime.utcnow()+datetime.timedelta(hours=5.5)
            time = now.strftime("%H:%M")
            time = int(time.replace(":", ""))
            r = int(row[3].replace(":", ""))
            if (r > time):
                result1.append(row)
    if (len(result1)) == 0:
        result = "No bus will run after this moment for today"
        result2 = "Here are some bus times from "+origin+" to "+destination
        for i in range(4):
            result2 = result2+"\ndepart at:" + \
                allData[i][3]+"-arrive at:"+allData[i][4]
    else:
        result = "The next bus is scheduled to depart at " + \
            result1[0][3] + " from " + origin + " to "+destination + \
            " and it will reach to the destination at "+result1[0][4]
        if (len(result1) == 1):
            result2 = "Here are some bus times from "+origin+" to "+destination
            if (len(allData) < 4):
                size = len(allData)
            else:
                size = 4
            for i in range(size):
                result2 = result2+"\ndepart at:" + \
                    allData[i][3]+"-arrive at:"+allData[i][4]
        else:
            result2 = "  After that bus, following times also have the buses from  " + \
                origin+" to "+destination

            for i in range(len(result1)-1):
                result2 = result2+"\ndepart at:" + \
                    result1[i+1][3]+"-arrive at:"+result1[i+1][4]
                if (i == 4):
                    break
    result = result+". "+result2

    return result


# gettraintimes
def getTrainTimeDetail(origin, destination):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)

        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "SELECT * FROM train_times WHERE origin=%s and destination=%s"
        location = (origin, destination)
        cursor.execute(sql_select_query, location)
        rows = cursor.fetchall()

    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))

    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

    if len(rows) == 0:
        result = "sorry!please enter a valid origin and destination:("
        return result
    else:
        result1 = []
        allData = []
        for row in rows:
            allData.append(row)
            now = datetime.datetime.utcnow()+datetime.timedelta(hours=5.5)
            time = now.strftime("%H:%M")
            time = int(time.replace(":", ""))
            r = int(row[3].replace(":", ""))
            if (r > time):
                result1.append(row)
    if (len(result1)) == 0:
        result = "No train will run after this moment for today"
        result2 = "Here are some train times from "+origin+" to "+destination
        if (len(allData) < 4):
            size = len(allData)
        else:
            size = 4
        for i in range(size):
            result2 = result2+"\n" + \
                allData[i][3]+"-train type:"+allData[i][5]

    else:
        result = "The next train is scheduled to depart at " + \
            result1[0][3] + " from " + origin + " to "+destination + " and the train type is  " + \
            result1[0][5] + ". This train is available on "+result1[0][4]+" "
        if (len(result1) == 1):
            result2 = ""
            if (len(allData) > 1):
                result2 = "Here are some other train times from "+origin+" to "+destination
                for i in range(len(allData)-1):
                    print(result2)
                    result2 = result2+"\n" + \
                        allData[i][3]+"-train type:"+allData[i][5]
        else:
            result2 = "After that train, following times also have the trains from  " + \
                origin+" to "+destination
            for i in range(len(result1)-1):
                result2 = result2+"\n" + \
                    result1[i+1][3]+"-train type:"+result1[i+1][5]
                if (i == 4):
                    break
    result = result+". "+result2
    return result


def bookBusTicket(origin, destination, date, time, bus_type):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)
        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "INSERT INTO bus_ticket_booking (origin,destination,date,time,bus_type) VALUES (%s ,%s, %s,%s,%s)"
        values = (origin, destination, date, time, bus_type)
        cursor.execute(sql_select_query, values)
        mySQLConnection.commit()

    except mysql.connector.Error as error:
        result = ("Failed to add the booking. Invalid date/time")
        return result
    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

        result = "i will send you a notification of confirmation!"
    return result


def bookTrainTicket(origin, destination, date, time, seat_type):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)
        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "INSERT INTO train_ticket_booking (origin,destination,date,time,train_type) VALUES (%s ,%s, %s,%s,%s)"
        values = (origin, destination, date, time, seat_type)
        cursor.execute(sql_select_query, values)
        mySQLConnection.commit()

    except mysql.connector.Error as error:
        result = ("Failed to add the booking. Invalid date/time")
        return result
    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

        result = "i will send you a notification of confirmation!"
    return result


def makeBusComplaint(bus_number, route_number, date, time, description):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)
        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "INSERT INTO bus_complaint (bus_number,route_number,date,time,description) VALUES (%s ,%s, %s,%s,%s)"
        values = (bus_number, route_number, date, time, description)
        cursor.execute(sql_select_query, values)
        mySQLConnection.commit()

    except mysql.connector.Error as error:
        result = ("Failed to make the complaint. Invalid date/time")
        return result
    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

        result = "i will send a report to authority regarding the given information."
    return result


def makeTrainComplaint(complaint_number, railway_station, date, time, description):
    try:
        mySQLConnection = mysql.connector.connect(
            host=databasehost, database=database, user=databaseuser, password=databasepassword)
        cursor = mySQLConnection.cursor(buffered=True)
        sql_select_query = "INSERT INTO train_complaint (complaint_number,railway_station,date,time,description) VALUES (%s ,%s,%s, %s,%s)"
        values = (complaint_number, railway_station, date, time, description)
        cursor.execute(sql_select_query, values)
        mySQLConnection.commit()

    except mysql.connector.Error as error:
        result = ("Failed to make the complaint. Invalid date/time")
        return result
    finally:
        if (mySQLConnection.is_connected()):
            cursor.close()
            mySQLConnection.close()
            print("MySQL connection is closed")

        result = "i will send a report to authority regarding the given information."
    return result


app = Flask(__name__)
CORS(app)

Quesions = [["what is the bus number?", "what is the route number?", "what is the incident date(format 'YYYY-MM-DD')?", "what is the incident time('hh:mm:ss')?", "please give a brief description about the incident", "Are you sure you want to make this complaint? (y/n)", "*"], ["what is the origin", "what is the destination", "*"], ["what is the origin", "what is the destination", "when will you hope to travel('YYYY-MM-DD')", "time ('hh:mm:ss')?", "bus type?(normal, semi luxary, luxary, super luxary)", "Add booking?(y/n)", "*"], ["what is the origin", "what is the destination", "*"], ["from bus or train?", "please provide the origin", "what is the destination", "*"], ["Hello, how can I help you?\nHere are the things I can do.\n1)View bus fees and train fees details.\nEg:I want to find bus fees from [Origin] to [Destination].,how to find  bus fees, train fees from [Origin] to [Destination]., how much I want to travel by train\n2)View bus schedules and train schedules\nEg:I want to find the bus schedule  from [Origin] to [Destination]. , want to find a train time, train times from [Origin] to [Destination].,when is the next bus from [Origin] to [Destination].\n3)View distance between two locations\nEg:want to find a distance, what is the distance between [Origin] to [Destination],how many kilometers from [Origin] to [destination] \n4)Book bus seats and train seats\nEg:I want to book a bus seat, how can I book a train seat\n5)make complaints about the bad services got when traveling by bus or train.\nEg:want to make a complaint about a bus,how to make a complaint about a train", "*"], ["Bye. See You Again!", "*"], ["Here are the things I can do.\n1)View bus fees and train fees details.\nEg:I want to find bus fees from [Origin] to [Destination].,how to find  bus fees, train fees from [Origin] to [Destination]., how much I want to travel by train\n2)View bus schedules and train schedules\nEg:I want to find the bus schedule  from [Origin] to [Destination]. , want to find a train time, train times from [Origin] to [Destination].,when is the next bus from [Origin] to [Destination].\n3)View distance between two locations\nEg:want to find a distance, what is the distance between [Origin] to [Destination],how many kilometers from [Origin] to [destination] \n4)Book bus seats and train seats\nEg:I want to book a bus seat, how can I book a train seat\n5)make complaints about the bad services got when traveling by bus or train.\nEg:want to make a complaint about a bus,how to make a complaint about a train", "*"], [
    "please choose the number from below that related to your complaint!\n1)Dirty railway station\n2)Dirty washrooms in the compartment\n3)Inappropriate behavior of the train staff\n4)Demand of bribery by the railway officials\n5)Unavailability of water in the train and station\n6)Not getting refund after the Cancellation of ticket\n7)Theft incidents in the compartment\n8)Poor quality of food\n", "what is the railway station related to the incident?", "what is the incident date('YYYY-MM-DD')", "at what time this happened?", "please give a brief description about the incident", "Are you sure you want to make this complaint? (y/n)", "*"], ["what is the origin station", "what is the destination station", "*"], ["what is the origin station", "what is the destination station", "when will you hope to travel('YYYY-MM-DD')", "time('hh:mm:ss')?", "seat type?(first class, second class, third class)", "Add booking?(y/n)", "*"], ["from where you need to know the next train time", "to where you need to know the next train time", "*"]]


@app.route('/')
def index():
    return '<h1>HIIIIIIIII</h1>'


@app.route('/transportation', methods=['POST'])
def predicttag():
    content = request.json
    tag = 0
    if content['tag'] == "-1":
        X = [text_prepare(content['msg'])]
        y = vectorizer.transform(X)
        p = model.predict_proba(y)[0]
        if (max(p) > 0.5):
            p = np.where(p == max(p))
            tag = p[0][0]

        else:
            tag = "-1"
            return jsonify({"result": "I can't unserstand you", "tag": str(tag), "completed": 1})

    else:
        x = [text_prepare(content['msg'])]
        y = vectorizer.transform(x)
        p = model.predict_proba(y)[0]
        if (max(p) > 0.4):
            p = np.where(p == max(p))
            tag = p[0][0]
        if (tag == 6):
            return jsonify({"result": "OK! anything else you want?", "tag": "-1", "completed": 1})
        tag = content['tag']

    completed = 0
    print(tag)
    if (tag == 1 or tag == 3 or tag == 9 or tag == 11):
        print(content['msg'])
        origin_dest = getLocation(content['msg'])
        print(origin_dest)
        if (len(origin_dest) == 2):
            completed = 1
            result = origin_dest[0]+"," + origin_dest[1]
            print(result)
            return jsonify({"result": result, "tag": str(tag), "completed": completed})

    if len(Quesions[tag])-1 == content['index']:
        completed = 1
    return jsonify({"result": Quesions[tag][content['index']], "tag": str(tag), "completed": completed})


@app.route('/busfee', methods=['GET'])
def busfee():
    content = request.args
    origin = content['origin']
    destination = content['destination']
    result = getBusFeesDetail(origin, destination)
    return jsonify({"result": result})


@app.route('/trainfee', methods=['GET'])
def trainfee():
    content = request.args
    origin_station = content['origin_station']
    destination_station = content['destination_station']
    result = getTrainFeesDetail(origin_station, destination_station)
    return jsonify({"result": result})


@app.route('/distance', methods=['GET'])
def distance():
    content = request.args
    media = content['media']
    origin = content['origin']
    destination = content['destination']

    if (media == 'bus'):
        result = getDistanceByBus(origin, destination)
    else:
        result = getDistanceByTrain(origin, destination)
    return jsonify({"result": result})


@app.route('/bustimes', methods=['GET'])
def bustimes():
    content = request.args
    origin = content['origin']
    destination = content['destination']
    result = getBusTimeDetail(origin, destination)
    return jsonify({"result": result})


@app.route('/traintimes', methods=['GET'])
def traintimes():
    content = request.args
    origin = content['origin']
    destination = content['destination']
    result = getTrainTimeDetail(origin, destination)
    return jsonify({"result": result})


@app.route('/busbooking', methods=['POST'])
def busbooking():
    content = request.json
    origin = content['origin']
    destination = content['destination']
    date = content['date']
    time = content['time']
    bus_type = content['bus_type']
    result = bookBusTicket(origin, destination, date, time, bus_type)
    return jsonify({"result": result})


@app.route('/trainbooking', methods=['POST'])
def trainbooking():
    content = request.json
    origin = content['origin']
    destination = content['destination']
    date = content['date']
    time = content['time']
    seat_type = content['seat_type']
    result = bookBusTicket(origin, destination, date, time, seat_type)
    return jsonify({"result": result})


@app.route('/buscomplaint', methods=['POST'])
def buscomplaint():
    content = request.json
    bus_number = content['bus_number']
    route_number = content['route_number']
    date = content['date']
    time = content['time']
    description = content['description']

    result = makeBusComplaint(
        bus_number, route_number, date, time, description)
    return jsonify({"result": result})


@app.route('/traincomplaint', methods=['POST'])
def traincomplaint():
    content = request.json
    complaint_number = content['complaint_number']
    railway_station = content['railway_station']
    date = content['date']
    time = content['time']
    description = content['description']
    result = makeTrainComplaint(
        complaint_number, railway_station, date, time, description)
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(host='0.0.0.0')
