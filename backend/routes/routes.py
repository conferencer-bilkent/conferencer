from flask import Blueprint
from routes.auth_routes import login, signup, logout, check_session, login_google, google_callback
from routes.conference_routes import create_conference, get_conferences, get_conference, invite_pc_member, appoint_superchair
from routes.ping_routes import ping
from routes.profile_routes import get_profile, update_profile, get_all_users
from routes.role_routes import assign_role, get_roles, get_role
from routes.chad_routes import send_chad, get_received_chad, get_sent_chad
from routes.paper_routes import  get_paper, get_all_papers, submit_paper, download_paper
from routes.review_routes import get_review, submit_review
from routes.notification_routes import get_notification, mark_notification_as_answered, mark_all_read
from routes.keywords_routes import get_keywords, add_keyword, set_keywords
from routes.track_routes import create_track, get_tracks_by_conference, appoint_track_chair, get_track_by_people, get_track_by_author, get_track_by_reviewer, get_track, get_all_tracks, get_all_relevant_people, get_all_papers_in_track
from routes.assignment_routes import create_assignment_for_track, get_assignments_for_reviewer, get_assigned_papers

# Define blueprints
auth_bp = Blueprint("auth", __name__)
conference_bp = Blueprint("conference", __name__)
ping_bp = Blueprint("ping", __name__)
profile_bp = Blueprint("profile", __name__)
role_bp = Blueprint("role", __name__)
chad_bp = Blueprint("chad", __name__)
paper_bp = Blueprint("paper", __name__)
review_bp = Blueprint("review", __name__)
upload_bp = Blueprint("upload", __name__)
notification_bp = Blueprint("notification", __name__)
keywords_bp = Blueprint("keywords", __name__)
track_bp = Blueprint("track", __name__)
assignment_bp = Blueprint("assignment", __name__)

# Route bindings (logic attached here)
auth_bp.route("/login", methods=["POST"])(login)
auth_bp.route("/signup", methods=["POST"])(signup)
auth_bp.route("/logout", methods=["POST"])(logout)
auth_bp.route("/session", methods=["GET"])(check_session)
auth_bp.route("/login/google")(login_google)
auth_bp.route("/login/google/callback")(google_callback)

conference_bp.route("/<conference_id>/invite_pc_member", methods=["POST"])(invite_pc_member)
conference_bp.route("/create", methods=["POST"])(create_conference)
conference_bp.route("/", methods=["GET"])(get_conferences)
conference_bp.route("/<conference_id>", methods=["GET"])(get_conference)
conference_bp.route("/<conference_id>/superchair", methods=["POST"])(appoint_superchair)

ping_bp.route("/", methods=["GET"])(ping)

profile_bp.route("/<user_id>", methods=["GET"])(get_profile)
profile_bp.route("/update", methods=["POST"])(update_profile)
profile_bp.route("/users", methods=["GET"])(get_all_users)

role_bp.route("/", methods=["POST"])(assign_role)
role_bp.route("/", methods=["GET"])(get_roles)
role_bp.route("/<user_id>", methods=["GET"])(get_role)

chad_bp.route("/send", methods=["POST"])(send_chad)
chad_bp.route("/inbox", methods=["GET"])(get_received_chad)
chad_bp.route("/outbox", methods=["GET"])(get_sent_chad)

paper_bp.route("/<paper_id>", methods=["GET"])(get_paper)
paper_bp.route("/", methods=["GET"])(get_all_papers)
paper_bp.route("/submit", methods=["POST"])(submit_paper)
paper_bp.route("/<paper_id>/download", methods=["GET"])(download_paper)

review_bp.route("/<review_id>", methods=["GET"])(get_review)
review_bp.route("/submit/<paper_id>", methods=["POST"])(submit_review)

notification_bp.route("/", methods=["GET"])(get_notification)
notification_bp.route("/mark_answered/<notification_id>/<is_accepted>", methods=["POST"])(mark_notification_as_answered)
notification_bp.route("/mark_read", methods=["POST"])(mark_all_read)

keywords_bp.route("/", methods=["GET"])(get_keywords)
keywords_bp.route("/<keyword>", methods=["POST"])(add_keyword)
keywords_bp.route("/", methods=["POST"])(set_keywords)

track_bp.route("/", methods=["GET"])(get_all_tracks)
track_bp.route("/<conference_id>/conference", methods=["GET"])(get_tracks_by_conference)
track_bp.route("/create", methods=["POST"])(create_track)
track_bp.route("/appoint_track_chairs", methods=["POST"])(appoint_track_chair)
track_bp.route("/<track_id>/people", methods=["GET"])(get_track_by_people)
track_bp.route("/<track_id>/author", methods=["GET"])(get_track_by_author)
track_bp.route("/<track_id>/reviewer", methods=["GET"])(get_track_by_reviewer)
track_bp.route("/<track_id>", methods=["GET"])(get_track)
track_bp.route("/<track_id>/relevant", methods=["GET"])(get_all_relevant_people)
track_bp.route("/<track_id>/assign", methods=["POST"])(create_assignment_for_track)
track_bp.route("/<track_id>/papers", methods=["GET"])(get_all_papers_in_track)

assignment_bp.route("/reviewer/<reviewer_id>", methods=["GET"])(get_assignments_for_reviewer)
assignment_bp.route("/reviewer/<reviewer_id>/papers", methods=["GET"])(get_assigned_papers)

# Register list
all_routes = [
    (auth_bp, "/auth"),
    (conference_bp, "/conference"),
    (ping_bp, "/ping"),
    (profile_bp, "/profile"),
    (role_bp, "/role"),
    (chad_bp, "/chad"),
    (paper_bp, "/paper"),
    (review_bp, "/review"), 
    (notification_bp, "/notification"),
    (keywords_bp, "/keywords"),
    (track_bp, "/track"),
    (assignment_bp, "/assignment"),
]
