import os

from pymongo import MongoClient
from flask_cors import CORS, cross_origin
from flask import Flask, request, Response, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, emit

from dao import UserDAO, CompanyDAO, DocumentDAO, MessageDAO, VersionDAO, RoleDAO
from enums import RoleType, CompanyType
from exceptions import (
    UserAlreadyExistsException,
    TooMuchEconomistsException,
    TooMuchDirectorsException,
    UserIsNotFoundException,
    TooMuchLawyersException
)

app = Flask(__name__)
cors = CORS(app)
app.config["JWT_SECRET_KEY"] = "secret-key"
jwt = JWTManager(app)

async_mode = None
socketio = SocketIO(app, async_mode=async_mode, cors_allowed_origins="*")

client = MongoClient(host=os.environ.get('MONGO_HOST', 'localhost'), port=int(os.environ.get('MONGO_PORT', 27017)))
users = UserDAO(client)
companies = CompanyDAO(client)
documents = DocumentDAO(client)
messages = MessageDAO(client)
versions = VersionDAO(client)
roles = RoleDAO(client)


@app.route('/api/v1/signup/', methods=["POST"])
def signup():
    json_data = request.json
    username = json_data.get('username', None)
    company_id = json_data.get('company_id', None)
    role_id = json_data.get('role_id', None)
    if not username or not company_id:
        return Response(status=400)
    try:
        users.create(username, role_id, company_id)
    except (
            UserAlreadyExistsException,
            TooMuchLawyersException,
            TooMuchEconomistsException,
            TooMuchDirectorsException,
    ) as e:
        return jsonify({'message': e.message}), 400
    response = {
        'message': 'User is created',
    }
    return jsonify(response), 201


@app.route('/api/v1/signin/', methods=["POST"])
def signin():
    json_data = request.json
    username = json_data.get('username', None)
    if not username:
        return Response(status=400)
    try:
        user = users.get_by_username(username)
    except UserIsNotFoundException as e:
        return jsonify({"message": e.message}), 400
    access_token = create_access_token(identity=user['id'])
    return jsonify({"access_token": access_token})


@app.route('/api/v1/users/', methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    return jsonify({**users.get_by_id(user_id)})


@app.route('/api/v1/users/<user_id>/', methods=["GET"])
@jwt_required()
def get_user(user_id):
    return jsonify({**users.get_by_id(user_id)})


@app.route('/api/v1/companies/<company_id>/', methods=["GET"])
@jwt_required()
def get_company(company_id):
    return jsonify({**companies.get_by_id(company_id)})


@app.route('/api/v1/companies/', methods=["POST"])
@jwt_required()
def create_company():
    json_data = request.json
    name = json_data.get('name', None)
    if not name:
        return Response(status=400)
    company_id = companies.create(name)
    if not company_id:
        return Response(status=400)
    return jsonify({'id': company_id, 'name': name}), 201


@app.route('/api/v1/documents/', methods=["GET"])
@jwt_required()
def get_all_documents():
    user_id = get_jwt_identity()
    user = users.get_by_id(user_id)
    document_list = documents.get_all(user['company_id'])
    return jsonify(document_list), 200


@app.route('/api/v1/documents/', methods=["POST"])
@jwt_required()
def create_document():
    json_data = request.json
    user_id = get_jwt_identity()
    user = users.get_by_id(user_id)
    data = json_data.get('data', None)
    title = json_data.get('title', None)
    document_companies = json_data.get('companies', None)
    if not title or not data or not document_companies or not isinstance(document_companies, list):
        return Response(status=400)
    document_id = documents.create(title, data, document_companies)
    versions.create(document_id, user['company_id'], data)
    response = {
        'document_id': document_id,
    }
    return jsonify(response), 201


@app.route('/api/v1/documents/<document_id>/', methods=["GET"])
@jwt_required()
def get_document(document_id):
    document = documents.get_by_id(document_id)
    version = versions.get_last(document['id'])
    document['data'] = version['data']
    return jsonify({**document})


@app.route('/api/v1/documents/<document_id>/', methods=["PATCH"])
@cross_origin()
@jwt_required()
def update_document_data(document_id):
    json_data = request.json
    user_id = get_jwt_identity()
    user = users.get_by_id(user_id)
    data = json_data.get('data', None)
    version_id = versions.create(document_id, user['company_id'], data)
    return jsonify({'version_id': version_id}), 200


@app.route('/api/v1/documents/<document_id>/approve/', methods=["PATCH"])
@jwt_required()
def approve_document(document_id):
    user_id = get_jwt_identity()
    user = users.get_by_id(user_id)
    return jsonify({**documents.approve(document_id, user['company_id'])})


@app.route('/api/v1/documents/<document_id>/economist_approve/', methods=["PATCH"])
@jwt_required()
def economist_approve(document_id):
    user_id = get_jwt_identity()
    user = users.get_by_id(user_id)
    return jsonify({**documents.economist_approve(document_id, user['company_id'])})


@app.route('/api/v1/documents/<document_id>/lawyer_approve/', methods=["PATCH"])
@jwt_required()
def lawyer_approve(document_id):
    user_id = get_jwt_identity()
    user = users.get_by_id(user_id)
    return jsonify({**documents.lawyer_approve(document_id, user['company_id'])})


@app.route('/api/v1/documents/<document_id>/versions/', methods=["GET"])
@jwt_required()
def get_all_versions(document_id):
    version_list = versions.get_all(document_id)
    return jsonify(version_list), 200


@app.route('/api/v1/versions/<version_id>/', methods=["GET"])
@jwt_required()
def get_version(version_id):
    version = versions.get_by_id(version_id)
    return jsonify(version), 200


@app.route('/api/v1/companies/', methods=["GET"])
def get_all_companies():
    company_list = companies.get_all()
    return jsonify(company_list), 200


@app.route('/api/v1/messages/<document_id>/', methods=["GET"])
@jwt_required()
def get_all_messages(document_id):
    user_id = get_jwt_identity()
    user = users.get_by_id(user_id)
    message_list = messages.get_all(document_id, user['company_id'])
    return jsonify(message_list), 200


@app.route('/api/v1/messages/', methods=["POST"])
@jwt_required()
def create_message():
    json_data = request.json
    company_id = json_data.get('company_id', None)
    document_id = json_data.get('document_id', None)
    message = json_data.get('message', None)
    receiver_id = json_data.get('receiver_id', None)
    if not document_id or not message:
        return Response(status=400)
    message_id = messages.create(document_id, company_id, message, receiver_id)
    response = {
        'message_id': message_id,
    }
    return jsonify(response), 201


@app.route('/api/v1/roles/', methods=["GET"])
def get_all_roles():
    role_list = roles.get_all()
    return jsonify(role_list), 200


@socketio.event
def document_update():
    print('qweqwe')
    emit('update_version_list', broadcast=True)


@socketio.event
def message():
    emit('update_message_list', broadcast=True)


@socketio.event
def document_list_update():
    emit('update_document_list', broadcast=True)


if __name__ == '__main__':
    [companies.create(company) for company in CompanyType.values()]
    [roles.create(role) for role in RoleType.values()]
    socketio.run(app, host=os.environ.get('FLASK_RUN_HOST', 'localhost'), port=os.environ.get('FLASK_RUN_PORT', 5000))
