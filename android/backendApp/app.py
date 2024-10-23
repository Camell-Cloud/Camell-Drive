from flask import Flask, request, jsonify
import pymysql
import boto3
import pytz
from datetime import datetime
import requests  # 여기에 추가합니다.



app = Flask(__name__)

# MySQL 데이터베이스 연결
def get_db_connection():
    return pymysql.connect(
        cursorclass=pymysql.cursors.DictCursor
    )

# S3 클라이언트 생성
s3 = boto3.client(
    region_name='ap-northeast-2'
)

bucket_name = 'camelldrive-s3-user-storage-bucket'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=1212)
