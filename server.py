""" This module is the basic server for the website. """

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route("/")
def homepage():
    """ Show the homepage."""
    return render_template("homepage.html")

@app.route("/sign-up")
def sign_up():
    """ Show sign-up form."""
    return render_template("sign-up.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
