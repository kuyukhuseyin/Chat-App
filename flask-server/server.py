from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['chatapp']
users_collection = db['users']
messages_collection = db['messages']

@app.route("/users", methods=["GET"])
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return jsonify({"users": users})

@app.route("/users", methods=["POST"])
def add_user():
    new_user = request.json
    users_collection.insert_one(new_user)
    return jsonify({"message": "User added successfully"}), 201

@app.route("/messages", methods=["GET"])
def get_messages():
    sender = request.args.get("sender")
    recipient = request.args.get("recipient")

    if sender and recipient:
        messages = list(messages_collection.find(
            {"$or": [
                {"senderId": sender, "recipientId": recipient},
                {"senderId": recipient, "recipientId": sender}
            ]}, 
            {"_id": 0}
        ))
    else:
        messages = list(messages_collection.find({}, {"_id": 0}))

    return jsonify({"messages": messages})

@app.route("/messages", methods=["POST"])
def post_messages():
    new_message = request.json
    messages_collection.insert_one(new_message)
    return jsonify({"message": "Message created successfully"}), 201

if __name__ == "__main__":
    app.run(debug=True)
