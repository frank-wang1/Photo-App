from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post
from views import get_authorized_user_ids

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        # body = request.get_json()
        # print(body)
        # return Response(json.dumps({}), mimetype="application/json", status=201)
        body = request.get_json()

        if not body.get('post_id'):
            return Response(json.dumps({"message": "'post_id' is required"}), mimetype="application/json", status=400)

        if not body.get('text'):
            return Response(json.dumps({"message": "'text' is required"}), mimetype="application/json", status=400)

        if not Comment.query.get(body.get('post_id')):
            return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)

        user_ids = get_authorized_user_ids(self.current_user)
        if Comment.query.get(body.get('post_id')).user_id not in user_ids:
            return Response(json.dumps({"message": "id is invalid"}), mimetype="application/json", status=404)

        new_post = Comment(
            post_id=body.get('post_id'),
            text=body.get('text'),
            user_id=self.current_user.id, # must be a valid user_id or will throw an error
        )
        db.session.add(new_post)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_post.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        # delete "Comment" record where "id"=id
        # print(id)
        # return Response(json.dumps({}), mimetype="application/json", status=200)
        Comment_rec = Comment.query.get(id)
        if not Comment_rec:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        if Comment_rec.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        
        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps("message:" "Following record id={0} was succesfully deleted.".format(id)), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': api.app.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
