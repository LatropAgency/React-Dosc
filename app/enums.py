from enum import Enum
from operator import attrgetter
from typing import Tuple


class BaseEnum(Enum):

    @classmethod
    def values(cls) -> Tuple:
        return tuple(map(attrgetter('value'), cls))

    @classmethod
    def names(cls) -> Tuple:
        return tuple(map(attrgetter('name'), cls))

    @classmethod
    def items(cls) -> Tuple:
        return tuple(zip(cls.values(), cls.names()))


class RoleType(BaseEnum):
    ECONOMIST = 'Economist'
    LAWYER = 'Lawyer'
    DIRECTOR = 'Director'


class CompanyType(BaseEnum):
    APPLE = 'Apple'
    TESLA = 'Tesla'
    GOOGLE = 'Google'
    ZESLA_GROUP = 'Zesla Group'
