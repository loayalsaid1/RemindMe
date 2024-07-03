from os import getenv

if getenv('x') == "test":
    print("there is a variable in the machine called x")
elif getenv("x") == "dev":
    print("A variable in the machine called x with value dev")
else:
    print(f"x is not set or set {getenv('x')}")

