from flask import Flask, request
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import scipy.sparse as sp
import pandas as pd
import json

def extractFeaturesNew(data):
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(data['metadata'])
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(data['overview_x'])
    combine_sparse = sp.hstack([count_matrix, tfidf_matrix], format='csr')
    cosine_sim = cosine_similarity(combine_sparse, combine_sparse)
    return cosine_sim

# get dataset
df = pd.read_csv("new_dataset.csv")
# get cosine matrix
cosine_sim = extractFeaturesNew(df)

return_features = ['title_x','title_y','overview_y','vote_average_x','vote_count_x','popularity_x','genres','cast','image_url']

def recommend_movies(id,df,similarity_matrix):
    if id not in df['id'].unique():
        return []
    
    indices = pd.Series(df.index, index = df['id'])
    index = indices[id]
    sim_scores = list(enumerate(similarity_matrix[index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:21]
    movie_indices = [i[0] for i in sim_scores]
    return df[['id','title_y','image_url']].iloc[movie_indices]

def weighted_rating(x,c,m):
    v = x['vote_count_x']
    R = x['vote_average_x']
    return (v/(v+m) * R) + (m/(m+v) * c)

app = Flask(__name__)

@app.route('/')
def get_page():
    return json.dumps("Welcome To Movie Recommender System")


@app.route('/get_movies_list')
def get_movie_titles():
    return json.dumps(df[['id','title_y']].to_dict('records'))


@app.route('/get_movie_info')
def get_movie_info():
    try:
        movie_id = request.args.get('id')
        movie_id = int(movie_id)
    except:
        return json.dumps("Given ID not acceptable")
    return json.dumps(df[df['id'] == movie_id][return_features].to_dict('records'))

@app.route('/get_recommended_movies')
def get_recommendation():
    try:
        movie_id = request.args.get('id')
        movie_id = int(movie_id)
    except:
        return json.dumps("Given ID not acceptable")
    return json.dumps(recommend_movies(movie_id,df,cosine_sim).to_dict('records'))
    
@app.route('/get_popular_movies')
def get_popular_movies():
    if 'popularity_x' in df.columns:
        return json.dumps(df.sort_values('popularity_x', ascending=False)[['id','title_y','image_url']].head(20).to_dict('records'))
    else:
        return {}

@app.route('/get_top_rated_movies')
def get_top_rated_movies():
    c = df['vote_average_x'].mean()
    m = df['vote_count_x'].quantile(0.9)
    q_movies = df.copy().loc[df['vote_count_x'] >= m]
    q_movies['score'] = q_movies.apply(lambda x : weighted_rating(x,c,m), axis=1)
    q_movies = q_movies.sort_values('score', ascending=False)
    return json.dumps(q_movies[['id','title_y','image_url']].head(20).to_dict('records'))

if __name__ == "__main__":
    app.run(debug=True)
