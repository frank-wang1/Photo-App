from multiprocessing import current_process
from flask import Response, request
from flask_restful import Resource
from models import Bookmark, bookmark, db
import json
from views import get_authorized_user_ids, can_view_post
import flask_jwt_extended

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # get all bookmarks owned by the current user
        bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id).all()
        bookmarks_json = [user.to_dict() for user in bookmarks]
        return Response(json.dumps(bookmarks_json), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        body = request.get_json()

        
        # print(body)
        # return Response(json.dumps({}), mimetype="application/json", status=201)
        
        # bookmark = Bookmark.query.get(body.get('post_id'))
        #checking if post id was given

        #got body
        # check if post id was in body if not retuern error
        # check if type of post id was string adn then if all characters in string is (isdecimal)


        #check if post id given
        if not body.get('post_id'):
            return Response(json.dumps({"message": "post_id is required"}), mimetype="application/json", status=400)
       
        post_id = body.get('post_id')

        if (type(post_id) == str and not post_id.isdecimal()) or (type(post_id) != int and type(post_id) != str):
            return Response(json.dumps({"message": "post id must be int"}), mimetype="application/json", status=400)
        
        if not can_view_post(post_id, self.current_user):
            return Response(json.dumps({"message": "cant view post"}), mimetype="application/json", status=404)
        
        #checking for duplicates
        num_of_bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id).filter_by(post_id=post_id).count()
        if num_of_bookmarks > 0:   
            return Response(json.dumps({"message" : "duplicate bookmark"}), mimetype="application/json", status=400)
        
        #checking that post id is valid
        # if not Bookmark.query.get(body.get('post_id')):
        # #     #check if it a sting(not working though)
        # #     if isinstance(body.get('post_id'),str):
        # #         bookmark_id = int(body.get('post_id'))
        # #     else:
        #     return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)

        
     
    
        # checking that post is authorized
        # user_ids = get_authorized_user_ids(self.current_user)
        # if can_view_post(int(body.get('post_id')),self.current_user) == False:
        #     return Response(json.dumps({"message": "not authorized"}), mimetype="application/json", status=404)

        

        new_Bookmark = Bookmark(
            user_id=self.current_user.id, # must be a valid user_id or will throw an error
            post_id=post_id
        )
        db.session.add(new_Bookmark)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_Bookmark.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "bookmark" record where "id"=id
        # print(id)
        # return Response(json.dumps({}), mimetype="application/json", status=200)
        bookmark = Bookmark.query.get(id)
        if not bookmark:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        if bookmark.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        
        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps("message:" "bookmark id was succesfully deleted.".format(id)), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
