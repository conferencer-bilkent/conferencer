from flask import Blueprint
from routes.auth_routes import login, signup, logout, check_session, login_google, google_callback
from routes.conference_routes import get_conference_by_id, create_conference, create_conference_from_series, get_conferences, get_my_conference_series, get_conference, invite_pc_member, update_conference, appoint_superchair, get_series_stats
from routes.ping_routes import ping
from routes.profile_routes import get_profile, update_profile, get_all_users, get_affiliations, add_affiliations
from routes.role_routes import assign_role, get_roles, get_role, get_role_status
from routes.chad_routes import send_chad, get_received_chad, get_sent_chad
from routes.paper_routes import  get_paper, get_all_papers, submit_paper, download_paper, get_biddings, bid, update_paper, decide, get_papers_of_user
from routes.review_routes import get_review, update_review, submit_review, get_reviews_by_paper, rate_review, avg_rate, get_review_by_assignment_id, avg_rate_of_user 
from routes.notification_routes import get_notification, mark_notification_as_answered, mark_all_read
from routes.keywords_routes import get_keywords, add_keyword, set_keywords
from routes.track_routes import create_track, get_tracks_by_conference, appoint_track_chair, get_track_by_people, get_track_by_author, get_track_by_reviewer, get_track, get_all_tracks, get_all_relevant_people, get_all_papers_in_track, appoint_track_member, get_track_members, get_effective_track_settings, update_track,  get_track_authors_by_papers_in_the_track, conflict_of_interest
from routes.assignment_routes import create_assignment_for_track, get_assignments_for_reviewer, get_assigned_papers, get_assignments_by_paper


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
conference_bp.route("/create_from_series", methods=["POST"])(create_conference_from_series)
conference_bp.route("/", methods=["GET"])(get_conferences)
conference_bp.route("/by_id/<conference_id>", methods=["GET"])(get_conference_by_id)
conference_bp.route("/series/my_series", methods=["GET"])(get_my_conference_series)
conference_bp.route("/<conference_id>", methods=["GET"])(get_conference)
conference_bp.route("/<conference_id>/superchair", methods=["POST"])(appoint_superchair)
conference_bp.route("/update_conference/<conference_id>", methods=["POST"])(update_conference)
conference_bp.route("/series/stats/<series_id>", methods=["GET"])(get_series_stats)

ping_bp.route("/", methods=["GET"])(ping)

profile_bp.route("/<user_id>", methods=["GET"])(get_profile)
profile_bp.route("/update", methods=["POST"])(update_profile)
profile_bp.route("/users", methods=["GET"])(get_all_users)
profile_bp.route("affiliations", methods=["GET"])(get_affiliations)
profile_bp.route("affiliations", methods=["POST"])(add_affiliations)

role_bp.route("/", methods=["POST"])(assign_role)
role_bp.route("/", methods=["GET"])(get_roles)
role_bp.route("/profile/my_roles", methods=["GET"])(get_role_status)
role_bp.route("/<role_id>", methods=["GET"])(get_role)

chad_bp.route("/send", methods=["POST"])(send_chad)
chad_bp.route("/inbox", methods=["GET"])(get_received_chad)
chad_bp.route("/outbox", methods=["GET"])(get_sent_chad)

paper_bp.route("/<paper_id>", methods=["GET"])(get_paper)
paper_bp.route("/", methods=["GET"])(get_all_papers)
paper_bp.route("/submit", methods=["POST"])(submit_paper)
paper_bp.route("/<paper_id>/download", methods=["GET"])(download_paper)
paper_bp.route("/<paper_id>/bid", methods=["POST"])(bid)
paper_bp.route("/<paper_id>/biddings", methods=["GET"])(get_biddings)
paper_bp.route("/<paper_id>/update", methods=["POST"])(update_paper)
paper_bp.route("/<paper_id>/decide", methods=["POST"])(decide)
paper_bp.route("/my_papers", methods=["GET"])(get_papers_of_user)

review_bp.route("/<review_id>", methods=["GET"])(get_review)
review_bp.route("/submit/<paper_id>", methods=["POST"])(submit_review)
review_bp.route("/paper/<paper_id>", methods=["GET"])(get_reviews_by_paper)
review_bp.route("/<review_id>/rate", methods=["POST"])(rate_review)         # review rateleri (chairs ve ayni paperdaki reviewerlardan gelen)
review_bp.route("/<review_id>/avg_rate", methods=["GET"])(avg_rate)         # reviewin kendi ratelerinin ortalamasi
review_bp.route("/<review_id>/update", methods=["POST"])(update_review)     # update atiyo
review_bp.route("/<assignment_id>/assignment",  methods=["GET"])(get_review_by_assignment_id)
review_bp.route("/avg_rate_of_user", methods=["GET"])(avg_rate_of_user)

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
track_bp.route("/appoint_track_members", methods=["POST"])(appoint_track_member)
track_bp.route("/<track_id>/members", methods=["GET"])(get_track_members)
track_bp.route('/<track_id>/effective_settings', methods=['GET'])(get_effective_track_settings)
track_bp.route('/update_track/<track_id>', methods=['post'])(update_track)
track_bp.route("/<track_id>/authors", methods=["GET"])(get_track_authors_by_papers_in_the_track)
track_bp.route("/<track_id>/conflicts", methods=["GET"])(conflict_of_interest)

assignment_bp.route("/reviewer/<reviewer_id>", methods=["GET"])(get_assignments_for_reviewer)
assignment_bp.route("/reviewer/<reviewer_id>/papers", methods=["GET"])(get_assigned_papers)
assignment_bp.route("/paper/<paper_id>", methods=["GET"])(get_assignments_by_paper)


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
