from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time


PATH="C:\Program Files (x86)\chromedriver.exe"
driver = webdriver.Chrome(PATH)

driver.get("https://minullamahewage.github.io/psichatbot/login")
print (driver.title)

link = driver.find_element_by_link_text("Don't have an account? Sign Up")
link.click()