from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
import time

PATH="C:\Program Files (x86)\chromedriver.exe"
driver = webdriver.Chrome(PATH)

driver.get("https://minullamahewage.github.io/psichatbot/login")
print (driver.title)


email=WebDriverWait(driver,10).until(lambda driver: driver.find_element_by_id("email"))
email.send_keys("test@gmail.com")

password=WebDriverWait(driver,10).until(lambda driver: driver.find_element_by_id("password"))
password.send_keys("12345678")

button=WebDriverWait(driver,10).until(lambda driver: driver.find_element_by_class_name("MuiButton-label"))
button.click()
#print (driver.page_source)

time.sleep(5)

driver.quit()