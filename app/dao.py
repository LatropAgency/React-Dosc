import abc
import os
from uuid import uuid1
import datetime

import pymongo

from enums import RoleType
from exceptions import (
    UserAlreadyExistsException,
    TooMuchEconomistsException,
    TooMuchDirectorsException,
    UserIsNotFoundException,
    TooMuchLawyersException
)


class BaseDAO(metaclass=abc.ABCMeta):
    def __init__(self, client):
        self.client = client
        self.db = self.client[os.environ.get('MONGO_DATABASE', 'ZeslaGroup')]

    @staticmethod
    def replace_id_column(item):
        item['id'] = item['_id']
        del item['_id']
        return item

    @abc.abstractmethod
    def create(self, *args, **kwargs):
        pass

    @abc.abstractmethod
    def get_all(self, *args, **kwargs):
        pass


class CompanyDAO(BaseDAO):
    def create(self, name):
        company = {
            '_id': str(uuid1()),
            'name': name,
        }
        if self.db.companies.find({'name': name}).count():
            return None
        return self.db.companies.insert(company)

    def get_all(self):
        return [BaseDAO.replace_id_column(company) for company in self.db.companies.find()]

    def get_by_id(self, company_id):
        company = self.db.companies.find_one({'_id': company_id})
        return CompanyDAO.replace_id_column(company)


class UserDAO(BaseDAO):
    def create(self, username, role_id, company_id):
        user = {
            '_id': str(uuid1()),
            'username': username,
            'role_id': role_id,
            'company_id': company_id,
        }
        if self.db.users.find({'username': username}).count():
            raise UserAlreadyExistsException()
        role = self.db.roles.find_one({'_id': role_id})
        if role['name'] == RoleType.DIRECTOR.value and self.db.users.find({
            'role_id': role['_id'],
            'company_id': company_id,
        }).count():
            raise TooMuchDirectorsException()
        if role['name'] == RoleType.ECONOMIST.value and self.db.users.find({
            'role_id': role['_id'],
            'company_id': company_id,
        }).count() > 2:
            raise TooMuchEconomistsException()
        if role['name'] == RoleType.LAWYER.value and self.db.users.find({
            'role_id': role['_id'],
            'company_id': company_id,
        }).count() > 2:
            return TooMuchLawyersException()
        return self.db.users.insert(user)

    def get_all(self):
        return [BaseDAO.replace_id_column(user) for user in self.db.users.find()]

    def get_by_username(self, username):
        user = self.db.users.find_one({'username': username})
        if not user:
            raise UserIsNotFoundException()
        return UserDAO.replace_id_column(user)

    def get_by_id(self, user_id):
        user = self.db.users.find_one({'_id': user_id})
        return UserDAO.replace_id_column(user)


class DocumentDAO(BaseDAO):
    def create(self, title, data, companies):
        document = {
            '_id': str(uuid1()),
            'title': title,
            'companies': companies,
            'approved': [],
            'economist_approved': [],
            'lawyer_approved': [],
        }
        document_id = self.db.documents.insert(document)
        return document_id

    def get_all(self, company_id):
        return [BaseDAO.replace_id_column(document) for document in self.db.documents.find(
            {'companies': {"$in": [company_id]}}
        )]

    def get_by_id(self, document_id):
        documents = self.db.documents.find_one({'_id': document_id})
        return BaseDAO.replace_id_column(documents)

    def approve(self, document_id, company_id):
        document = self.get_by_id(document_id)
        if company_id not in document['approved']:
            document['approved'].append(company_id)
        self.db.documents.update({'_id': document_id}, {"$set": {"approved": document['approved']}})
        return document

    def economist_approve(self, document_id, company_id):
        document = self.get_by_id(document_id)
        if company_id not in document['economist_approved']:
            document['economist_approved'].append(company_id)
        self.db.documents.update({'_id': document_id}, {"$set": {"economist_approved": document['economist_approved']}})
        return document

    def lawyer_approve(self, document_id, company_id):
        document = self.get_by_id(document_id)
        if company_id not in document['lawyer_approved']:
            document['lawyer_approved'].append(company_id)
        self.db.documents.update({'_id': document_id}, {"$set": {"lawyer_approved": document['lawyer_approved']}})
        return document

    def update_data(self, document_id, data):
        self.db.documents.update({'_id': document_id}, {"$set": {"data": data}})
        return self.get_by_id(document_id)


class VersionDAO(BaseDAO):
    def create(self, document_id, company_id, data):
        document_data = {
            '_id': str(uuid1()),
            'document_id': document_id,
            'company_id': company_id,
            'data': data,
            'datetime': datetime.datetime.now(),
        }
        return self.db.versions.insert(document_data)

    def get_all(self, document_id):
        return [BaseDAO.replace_id_column(document_data) for document_data in self.db.versions.find(
            {'document_id': document_id},
        ).sort('datetime', pymongo.DESCENDING)]

    def get_by_id(self, version_id):
        version = self.db.versions.find_one({'_id': version_id})
        return BaseDAO.replace_id_column(version)

    def get_last(self, document_id):
        document_data = self.db.versions.find({'document_id': document_id}).sort('datetime', pymongo.DESCENDING)[0]
        return BaseDAO.replace_id_column(document_data)


class MessageDAO(BaseDAO):
    def create(self, document_id, company_id, message, receiver_id=None):
        message = {
            '_id': str(uuid1()),
            'document_id': document_id,
            'company_id': company_id,
            'message': message,
            'receiver_id': receiver_id,
            'datetime': datetime.datetime.now(),
        }
        return self.db.messages.insert(message)

    def get_all(self, document_id, company_id):
        return [BaseDAO.replace_id_column(message) for message in self.db.messages.find({
            'document_id': document_id
        }).sort('datetime', pymongo.DESCENDING)]


class RoleDAO(BaseDAO):
    def create(self, name):
        role = {
            '_id': str(uuid1()),
            'name': name,
        }
        if self.db.roles.find({'name': name}).count():
            return None
        return self.db.roles.insert(role)

    def get_all(self):
        return [BaseDAO.replace_id_column(role) for role in self.db.roles.find()]

    def get_by_id(self, role_id):
        role = self.db.roles.find_one({'_id': role_id})
        return BaseDAO.replace_id_column(role)
