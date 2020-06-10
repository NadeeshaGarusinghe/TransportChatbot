from flask import Flask, request, jsonify
import numpy as np
import pymysql
import re
import pickle
from nltk.corpus import stopwords
from flask_cors import CORS
import nltk
from xgboost import XGBClassifier


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


vectorizer = pickle.load(open("../end_point_testing/vectorizer.pk", "rb"))
model = XGBClassifier()
model.load_model("../end_point_testing/xgboost_model.json")

questions=[]
expected_results=[]
predicted_results=[]
f=open("questions.txt","r")
t=open("expected_results.txt","r")

for i in f:
    questions.append(i)
for j in t:
    expected_results.append(j)
questions=questions[:-1]
def predicttag(i):
    X = [text_prepare(i)]
    y = vectorizer.transform(X)
    p = model.predict_proba(y)[0]
    p = np.where(p == max(p))
    tag = p[0][0]
    return tag

count=0
for i in questions:
    predicted_results.append(predicttag(i))

print (predicted_results)
print (len(predicted_results))
    