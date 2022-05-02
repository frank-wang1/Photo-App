from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        following = Following.query.filter_by(user_id = self.current_user.id).all()
        following_json = [followee.to_dict_following() for followee in following]
        return Response(json.dumps(following_json), mimetype="application/json", status=200)
        #return Response(json.dumps([]), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()

 
        following_id = body.get('user_id')

        #not working
        if following_id in (Following.query.filter_by(user_id = self.current_user.id).all()):
            return Response(json.dumps({"message": "'user_url' is required"}), mimetype="application/json", status=400)
        
        #this is right
        if not following_id:
            return Response(json.dumps({"message": "'user_url' is required"}), mimetype="application/json", status=400)
       
        new_post = Following(self.current_user.id, following_id)
        #if new_post.user_id != self.current_user.id:
        #    return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=201)

        db.session.add(new_post)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_post.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        print(id)
        return Response(json.dumps({}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
