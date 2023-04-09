from pymongo import MongoClient
from flask import Flask, request, render_template, make_response, redirect, url_for
import logging


app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://anannannan0102:RbvyVTsA8tzG9o5W@cluster0.mxggl0u.mongodb.net/?retryWrites=true&w=majority")
db = client.membership
collection = db.member_data
members = collection.find()

for member in members:
    print(member)
