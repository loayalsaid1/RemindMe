#!/usr/bin/python3
"""Console to interact with the data in the terminal"""

import cmd
from models import storage
from models.base_model import BaseModel
from models.user import User
from models.reflection import Reflection
from models.streak import Streak
from models.reminder import Reminder


classes = {
    "BaseModel": BaseModel,
    "User": User,
    "Reflection": Reflection,
    "Streak": Streak,
    "Reminder": Reminder
}


class RemindMeConsole(cmd.Cmd):
    """instance of CMD to interact with the data in the terminal"""
    prompt = "(RemindMe) "

    @staticmethod
    def parse_type(text):
        """Detect the type of the text passed to it.
             Is it a number, float or string
        """
        try:
            return int(text)
        except ValueError:
            try:
                return float(text)
            except ValueError:
                return text

    def precmd(self, line):
        """Safegaurds for argumets given to the classes we have.."""

        splits = line.split()
        command = splits[0]
        args = splits[1:]

        if command in ["create", "show", "destroy", "update"]:
            if len(args) == 0:
                print("** class name missing **")
                return ""
            if args[0] not in classes:
                print("** class doesn't exist **")
                return ""
        if command in ["show", "destroy", "update"]:
            if not len(args) >= 2:
                print("** instance id missing **")
                return ""
            elif f"{args[0]}.{args[1]}" not in storage.all():
                print("** no instance found **")
                return ""
        if command == "update":
            if len(args) < 3:
                print("** attribute name missing **")
                return ""
            if len(args) < 4:
                print("** value missing **")
                return ""
        if command == "all" and args:
            if args[0] not in classes:
                print("** class doesn't exist **")
                return ""

        if command == "create" and len(args[1:]) % 2 != 0:
            del args[-1]

        return line

    def emptyline(self):
        pass

    def do_create(self, args):
        """Create an object"""
        args = args.split()
        new_object = classes[args[0]]()
        for i in range(1, len(args), 2):
            setattr(new_object, args[i],
                    RemindMeConsole.parse_type(args[i+1]))
        print(new_object.id)
        storage.save()

    def help_create(self):
        """Document create"""
        print("Usage: create <class name>\n")
        print("Create an object\n")

    def do_show(self, args):
        """Show string represintation of an object"""
        args = args.split()
        obj = storage.get(classes[args[0]], args[1])
        if (obj):
            print(obj)

    def help_show(self):
        """Document show"""
        print("Usage: show <class name> <id>\n")
        print("Show string represintation of an object\n")

    def do_destroy(self, args):
        """Destroy an object AKA, delete it from storage"""
        args = args.split()
        cls = classes[args[0]]
        id = args[1]
        obj = storage.get(cls, id)
        storage.delete(obj)
        storage.save()

    def help_destroy(self):
        """Document destroy"""
        print("Usage: destroy <class name> <id>\n")
        print("Destroy an object AKA, delete it from storage\n")

    def do_all(self, args):
        """Show all objects / All objects of a class"""
        if args:
            args = args.split()
            cls = classes[args[0]]
            objects = storage.all(cls)
        else:
            objects = storage.all()
        [print(obj) for obj in objects.values()]
        print(len(objects))

    def help_all(self):
        """Document all"""
        print("Usage: all [<class name>]\n")
        print("Show all objects / All objects of a class\n")

    def do_update(self, args):
        """Update attibutes of an existent object"""
        args = args.split()
        obj = storage.get(classes[args[0]], args[1])
        setattr(obj, args[2], RemindMeConsole.parse_type(args[3]))
        storage.save()

    def help_update(self):
        """Document update"""
        print("Usage: update <class name> <id>\
<attribute name> <attribute value>\n")
        print("Update attibutes of an existent object\n")

    def do_quit(self, args):
        """Quit command to exit the program"""
        return True

    def help_quit(self):
        """Document quit"""
        print("Quit command to exit the program\n")

    def do_EOF(self, args):
        """Quit command to exit the program"""
        return True

    def help_EOF(self):
        """Document EOF"""
        print("EOF Signal to exit the program\n")


if __name__ == "__main__":

    RemindMeConsole().cmdloop()
