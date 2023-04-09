from flask import Flask, request, render_template, make_response, redirect, url_for, session, flash
from pymongo import MongoClient
from datetime import timedelta
from dotenv import dotenv_values
import logging

config = dotenv_values(".env")  # 讀取.env
admin = {"account": "iamadmin", "password": "iamadmin"}
client = MongoClient(config["ATLAS_URI"])
application = Flask(__name__, static_folder='/', static_url_path='/')
application.logger.setLevel(logging.DEBUG)
application.secret_key = 'your_secret_key'
application.config['PERMANENT_SESSION_LIFETIME'] = timedelta(
    minutes=30)  # 登入有效時間30分鐘


@application.route("/index")
def index():
    if 'username' not in session:
        flash("請先登入")
        return redirect(url_for('login'))
    return render_template("index.html")


@application.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        account = request.form.get("Username")
        password = request.form.get("Password")

        if (account == admin["account"] and password == admin["password"]):
            response = make_response(redirect(url_for("memberlist")))
            session['username'] = admin["account"]
            return response

        db = client.membership
        collection = db.member_data
        member = collection.find_one(
            {"account": account, "password": password})
        if member:
            response = make_response(redirect(url_for("index")))
            session['username'] = account
            return response
        else:
            # 失敗跳出錯誤訊息
            error_msg = ("Invalid account or password")
            return render_template("login.html", error_msg=error_msg)
    else:
        # GET
        return render_template("login.html")


@application.route("/register")
def register():
    return render_template("register.html")


@application.route("/memberlist")
def memberlist():
    if 'username' not in session:
        flash("請先登入")
        return redirect(url_for('login'))
    elif session['username'] != admin['account']:
        flash("你並非管理員")
        return redirect(url_for('index'))
    # 查詢所有會員頁面
    return render_template("memberlist.html")


@application.route("/logout")
def logout():
    session.clear()  # 清除 session
    return redirect(url_for('login'))


if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
