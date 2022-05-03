from flask import Response, request
from flask_restful import Resource
from models import Following
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        '''
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        '''

        # user_ids_tuples = (
        # db.session
        # .query(Following.following_id)
        # .filter(Following.user_id == self.current_user.id)
        # .order_by(Following.following_id)
        # .all()
        # )
        # user_ids = [id for (id,) in user_ids_tuples]

        # user_ids.append(self.current_user.id)

        # print(len(user_ids))

        # following = Following.query.filter_by(following_id = self.current_user.id)
        # following_json = [followee.to_dict_follower() for followee in following]
        # return Response(json.dumps(following_json), mimetype="application/json", status=200)

        #Random Comment test

        followers = Following.query.filter_by(following_id = self.current_user.id).all()
        following_json = [followee.to_dict_follower() for followee in followers]
        return Response(json.dumps(following_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
