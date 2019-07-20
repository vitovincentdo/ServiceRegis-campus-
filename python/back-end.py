from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import json
import os
from ibm_watson import TextToSpeechV1
# import pyrebase

# config = {
#     'apiKey': "AIzaSyDXbGyjSQK0GDlS6S35vGT6SwrsQ4k9h0M",
#     'authDomain': "storage-ython.firebaseapp.com",
#     'databaseURL': "https://storage-ython.firebaseio.com",
#     'projectId': "storage-ython",
#     'storageBucket': "storage-ython.appspot.com",
#     'messagingSenderId': "641939861729"
# }

# firebase = pyrebase.initialize_app(config)
# db = firebase.database()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins":"*"}})

text_to_speech = TextToSpeechV1(
  iam_apikey= 'iOm41QcRS9V0-yfP22WpZA32yrM0_HQG8M1JlDa51Fn_',
  url= 'https://gateway-tok.watsonplatform.net/text-to-speech/api'
)

# POST article Data
@app.route('/api/data/post', methods=['POST'])
def postJsonArticleHandler():
  content = request.get_json()
  unpack = content['data']['name']
  print(content)

  with open('../public/audio/response.wav', 'wb') as audio_file:
    audio_file.write(
      text_to_speech.synthesize(
        'welcome '+str(unpack),
        voice='en-US_AllisonVoice',
        accept='audio/wav'
      ).get_result().content
    )
  audio_file.close()

  if os.path.exists('../../data/data.json'):
    with open('../../data/data.json', 'w') as file:
      # data = json.load(file)
      # dictData = data['datas']
      # counter = dictData['counter'] + 1
      temp = {}
      tempList = []

      temp['id'] = 1
      temp['name'] = str(unpack)
      # temp['counter'] = counter
      tempList.append(temp)
      tempDict = dict(datas=tempList)
      file.write(json.dumps(tempDict))
      file.close()
  else:
    with open('../../data/data.json', 'w') as createData:
      temp = {}
      tempList = []

      temp['id'] = 1
      temp['name'] = str(unpack)
      # temp['counter'] = 0
      tempList.append(temp)
      tempDict = dict(datas=tempList)
      createData.write(json.dumps(tempDict))
      createData.close()
  # data = {}
  # data[""]

  tempID = {}
  tempContent = []
  tempResponse = {}
  tempID['id'] = "1"
  tempContent.append(tempID)
  tempResponse['datas']= tempContent
  js = json.dumps(tempResponse)
  print(js)
  resp = Response(js, status=201, mimetype='application/json')
  return resp

@app.route('/api/data/list', methods=['GET'])
def dataList():
  with open('../../data/data.json', 'r') as read_file:
    data = json.load(read_file)
    # dictData = data['datas']
    return jsonify(data)



if __name__ == '__main__':
    app.run(debug=True)
