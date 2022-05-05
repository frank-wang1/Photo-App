from multiprocessing import current_process
from flask import Response, request
from flask_restful import Resource
from models import Bookmark, bookmark, db
import json
from views import get_authorized_user_ids, can_view_post

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # get all bookmarks owned by the current user
        bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id).all()
        bookmarks_json = [user.to_dict() for user in bookmarks]
        return Response(json.dumps(bookmarks_json), mimetype="application/json", status=200)

    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        body = request.get_json()

        #bookmark_id = body.get('post_id')
        # print(body)
        # return Response(json.dumps({}), mimetype="application/json", status=201)
        
        #bookmark = Bookmark.query.get(bookmark_id)
        #checking if post id was given


        if not body.get('post_id'):
            return Response(json.dumps({"message": "post_id is required"}), mimetype="application/json", status=400)
       
        #checking that post id is valid
        if not Bookmark.query.get(body.get('post_id')):
            #check if it a sting(not working though)
            if isinstance(body.get('post_id'),str):
                bookmark_id = int(body.get('post_id'))
            else:
                return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)

        
        #checking for duplicates
        bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id).all()
        if int(body.get('post_id')) in [b.post_id for b in bookmarks]:   
            return Response(json.dumps({"message" : "duplicate bookmark"}), mimetype="application/json", status=400)
    
        #checking that post is authorized
        # user_ids = get_authorized_user_ids(self.current_user)
        if can_view_post(int(body.get('post_id')),self.current_user) == False:
            return Response(json.dumps({"message": "not authorized"}), mimetype="application/json", status=404)

        new_post = Bookmark(
            user_id=self.current_user.id, # must be a valid user_id or will throw an error
            post_id=body.get('post_id')
        )
        db.session.add(new_post)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_post.to_dict), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
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
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
