class UserIsNotFoundException(Exception):
    message = "User is not found"


class UserAlreadyExistsException(Exception):
    message = "User already exists"


class TooMuchDirectorsException(Exception):
    message = "Too much directors"


class TooMuchEconomistsException(Exception):
    message = "Too much economists"


class TooMuchLawyersException(Exception):
    message = "Too much lawyers"