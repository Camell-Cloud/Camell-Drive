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

# 임시로 사용자 데이터를 저장하는 API
@app.route('/save-temp-user', methods=['POST'])
def save_temp_user():
    data = request.json

    if not data or 'username' not in data or 'private_key' not in data:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    username = data.get('username')
    private_key = data.get('private_key')  # 클라이언트에서 전달된 private_key 사용
    S3FolderName = f"{username}/"  # username + "/" 형식으로 S3FolderName 설정
    image_url = 'https://camelldrive-official-backend-bucket.s3.ap-northeast-2.amazonaws.com/default_avatar.png'

    # 현재 시간 UTC에서 KST로 변환
    utc_now = datetime.utcnow()  # 현재 UTC 시간
    kst = pytz.timezone('Asia/Seoul')  # 한국 표준시 타임존
    kst_now = utc_now.astimezone(kst)  #  UTC 시간을 KST로 변환
    
    # MySQL에 사용자 정보 저장
    connection = get_db_connection()
    with connection.cursor() as cursor:
        try:
            cursor.execute('''
                INSERT INTO User (username, private_key, S3FolderName, create_at, img_url)
                VALUES (%s, %s, %s, %s, %s)
            ''', (username, private_key, S3FolderName, kst_now, image_url))
            connection.commit()
            
            # S3에 폴더 생성
            try:
                folders = ['favorites/', 'file/', 'media/', 'trashBin/']
                for folder in folders:
                    s3.put_object(Bucket=bucket_name, Key=f"{S3FolderName}{folder}")

                return jsonify({"success": True, "message": "User saved temporarily and S3 folder created", "private_key": private_key}), 200
            except Exception as e:
                return jsonify({"success": False, "message": f"Failed to create S3 folders: {str(e)}"}), 500
        except pymysql.MySQLError as e:
            return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
    connection.close()

@app.route('/save-pin', methods=['POST'])
def save_pin():
    data = request.json

    # 요청에 필요한 데이터가 있는지 확인
    if not data or 'username' not in data or 'pin' not in data:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    username = data.get('username')
    pin = data.get('pin')

    # 데이터베이스에 PIN 저장
    connection = get_db_connection()
    with connection.cursor() as cursor:
        try:
            cursor.execute('''
                UPDATE User
                SET pin = %s
                WHERE username = %s
            ''', (pin, username))
            connection.commit()
            return jsonify({"success": True, "message": "PIN saved successfully"}), 200
        except pymysql.MySQLError as e:
            return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
        finally:
            connection.close()

@app.route('/check-private-key', methods=['POST'])
def check_private_key():
    data = request.json

    if not data or 'private_key' not in data:
        return jsonify({"success": False, "message": "Missing private_key field"}), 400

    private_key = data.get('private_key')

    connection = get_db_connection()
    with connection.cursor() as cursor:
        cursor.execute("SELECT username FROM User WHERE private_key = %s", (private_key,))
        user = cursor.fetchone()

        if user:
            return jsonify({"success": True, "username": user['username']}), 200
        else:
            return jsonify({"success": False, "message": "Invalid private key"}), 400
    connection.close()

@app.route('/confirm-user', methods=['POST'])
def confirm_user():
    data = request.json

    if not data or 'username' not in data:
        return jsonify({"success": False, "message": "Missing username field"}), 400

    username = data.get('username')
    
    connection = get_db_connection()
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM User WHERE username = %s', (username,))
        user = cursor.fetchone()
        if user:
            return jsonify({"success": True, "message": "User data confirmed", "user": user}), 200
        else:
            return jsonify({"success": False, "message": "User not found"}), 404
    connection.close()

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "message": "Internal server error"}), 500

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"success": False, "message": "Resource not found"}), 404


@app.route('/get-balance', methods=['POST'])
def get_balance():
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({"success": False, "message": "Username is required"}), 400

    connection = get_db_connection()
    with connection.cursor() as cursor:
        cursor.execute("SELECT CAMT_amount FROM User WHERE username = %s", (username,))
        result = cursor.fetchone()

        if result:
            return jsonify({"success": True, "balance": result['CAMT_amount']}), 200
        else:
            return jsonify({"success": False, "message": "User not found"}), 404
    connection.close()

@app.route('/check-username', methods=['POST'])
def check_username():
    data = request.json
    if not data or 'username' not in data:
        return jsonify({"success": False, "message": "Missing username field"}), 400

    username = data.get('username')

    # 데이터베이스에서 유저네임 확인
    connection = get_db_connection()
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM User WHERE username = %s', (username,))
        user = cursor.fetchone()

        if user:
            return jsonify({"success": True, "exists": True}), 200
        else:
            return jsonify({"success": True, "exists": False}), 404
    connection.close()

@app.route('/update-amount', methods=['POST'])
def update_amount():
    app.logger.info('Received /update-amount request')

    data = request.json
    app.logger.info(f'Request data: {data}')

    if not data or 'sender' not in data or 'receiver' not in data or 'amount' not in data:
        app.logger.error(f'Missing required fields. Data: {data}')
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    sender = data.get('sender')
    receiver = data.get('receiver')
    amount = data.get('amount')

    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")
    except ValueError as e:
        app.logger.error(f'Invalid amount: {amount}, Error: {e}')
        return jsonify({"success": False, "message": "Invalid amount value"}), 400

    app.logger.info(f'Sender: {sender}, Receiver: {receiver}, Amount: {amount}')

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # 보내는 사람의 잔액 확인
            cursor.execute('SELECT CAMT_amount FROM User WHERE username = %s', (sender,))
            sender_balance = cursor.fetchone()

            if sender_balance is None:
                app.logger.error(f'Sender not found: {sender}')
                return jsonify({"success": False, "message": "Sender not found"}), 404

            if sender_balance['CAMT_amount'] < amount:
                app.logger.error(f'Insufficient funds for sender: {sender}')
                return jsonify({"success": False, "message": "Insufficient funds"}), 400

            # 보내는 사람의 잔액 차감
            cursor.execute('''
                UPDATE User
                SET CAMT_amount = CAMT_amount - %s
                WHERE username = %s
            ''', (amount, sender))

            # 받는 사람의 잔액 추가
            cursor.execute('''
                UPDATE User
                SET CAMT_amount = CAMT_amount + %s
                WHERE username = %s
            ''', (amount, receiver))

            connection.commit()

        app.logger.info('Transaction successfully completed')
        return jsonify({"success": True, "message": "Transaction completed successfully"}), 200

    except Exception as e:
        app.logger.error(f'Error processing transaction: {e}')
        return jsonify({"success": False, "message": f"Error processing transaction: {str(e)}"}), 500

@app.route('/save-wallet-address', methods=['POST'])
def save_wallet_address():
    data = request.json

    if not data or 'username' not in data or 'personal_wallet_address' not in data:
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    username = data.get('username')
    personal_wallet_address = data.get('personal_wallet_address')

    # 데이터베이스에 personal_wallet_address 저장
    connection = get_db_connection()
    with connection.cursor() as cursor:
        try:
            cursor.execute('''
                UPDATE User
                SET personal_wallet_address = %s
                WHERE username = %s
            ''', (personal_wallet_address, username))
            connection.commit()
            return jsonify({"success": True, "message": "Personal wallet address saved successfully"}), 200
        except pymysql.MySQLError as e:
            return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
        finally:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=1212)
