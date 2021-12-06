""" This module is the basic server for the website. """

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
