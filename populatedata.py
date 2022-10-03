from secrets import *
import requests
from datetime import datetime, timedelta
import random
import pymongo
from nanoid import generate

HOST = "http://34.172.188.42:80"
GET_ACCESS_TOKEN_URL = "/api/users/oauth2/tokens"
CREATE_FOOD_ENTRY_URL = "/api/users/:username/food-entries"
DELETE_ALL_ENTRIES_URL = "/api/users/:username/food-entries"

mongo_client = pymongo.MongoClient(mongo_url)
caltrack_db = mongo_client[caltrack_db_name]

meal_info_map = {
	"meal1" : { "time" : "09:00", "options": [("Cereal",400), ("Idli", 300), ("Dosa", 400), ("Salad", 400), ("Fries", 400), ("Juice", 200)]},
	"meal2" : { "time" : "11:00", "options": [("Tea", 100), ("Milk", 100), ("Chocoloates", 400), ("Apple", 50), ("Chips", 500), ("Eggs", 150)]},
	"meal3" : { "time" : "13:00", "options": [("Pizza", 1000), ("Sandwich", 300), ("Rice", 500), ("Salad", 400), ("Burger", 300), ("Pasta", 400)]},
	"meal4" : { "time" : "15:00", "options": [("Fries", 400), ("Chocoloates", 400), ("Fruits", 100), ("Soup", 150), ("Bread", 100), ("Milk", 100)]},
	"meal5" : { "time" : "17:00", "options": [("Pizza", 1000), ("Tacos", 300), ("Chips", 400), ("Burrito", 300), ("Burger", 300), ("Fruits", 100)]},
	"meal6" : { "time" : "20:00", "options": [("Pasta", 400), ("Sandwich", 300), ("Dosa", 400), ("Roti", 300), ("Eggs", 150), ("Cereal", 300)]},
}

username = "naveenmraja@gmail.com"
days_to_populate = 7

def get_access_token() :
	url = HOST + GET_ACCESS_TOKEN_URL
	data = {"username": admin_username, "password": admin_password}
	response = requests.post(url=url, json=data)
	if(response.status_code == 200) :
		admin_access_token = response.json().get("accessToken")
		return admin_access_token

def delete_all_entries() :
    url = HOST + DELETE_ALL_ENTRIES_URL.replace(":username", username)
    headers = {
    		"Authorization" : "Bearer " + admin_access_token
    }
    print(url)
    response = requests.delete(url=url, headers=headers)
    if(response.status_code == 204) :
        print("Deleted all entries for ", username)
    else :
        print("Error deleting entries ", response.status_code)

def add_entry_to_db(meal, consumption_date, timestamp):
    meal_info = meal_info_map.get(meal)
    time = meal_info.get("time")
    food_choices = meal_info.get("options")
    (food, calories) = random.choice(food_choices)
    food_entry = {
        "id" : "entry_" + generate(),
        "food" : food,
        "consumptionDate" : consumption_date,
        "consumptionTime" : time,
        "calories" : calories,
        "username" : username,
        "createdAt" : timestamp,
        "updatedAt" : timestamp,
        "__v" : 0
    }
    print(food_entry)
    food_entries = caltrack_db["food_entries"]
    result = food_entries.insert_one(food_entry)
    print(result.inserted_id)

def create_entry_with_api(meal, consumption_date, admin_access_token) :
	meal_info = meal_info_map.get(meal)
	time = meal_info.get("time")
	food_choices = meal_info.get("options")
	(food, calories) = random.choice(food_choices)
	data = {
		"food" : food,
	    "consumptionDate" : consumption_date,
	    "consumptionTime" : time,
	    "calories" : calories
	}
	url = HOST + CREATE_FOOD_ENTRY_URL.replace(":username", username)
	headers = {
		"Authorization" : "Bearer " + admin_access_token
	}
	print(url, data)
	response = requests.post(url=url, json=data, headers=headers)
	print("Create entry response : ", response.status_code)
	if(response.status_code == 200) :
		print(response.json())

if __name__ == '__main__' :
    menu = """
    Menu :
    1. Create entries
    2. Delete entries
    Please enter your option :
    """
    option = input(menu)
    if option == "1":
        username = input("Please enter the username : ")
        days_to_populate = int(input("Enter the days to populate : "))
        if days_to_populate > 300:
            print("Max days allowed is 300")
        else:
            admin_access_token = get_access_token()
            today = datetime.utcnow()
            for i in range(days_to_populate):
                date = today - timedelta(days=i)
                consumption_date = date.strftime('%Y-%m-%d')
                for j in range(1, 7):
                    #create_entry_with_api("meal" + str(j), consumption_date, admin_access_token)
                    add_entry_to_db("meal" + str(j), consumption_date, date)
    elif option == "2":
        username = input("Please enter the username : ")
        admin_access_token = get_access_token()
        delete_all_entries()
    else :
        print("Invalid input")



