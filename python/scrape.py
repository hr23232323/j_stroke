import re
import pandas as pd
import requests
import urllib.request

import time


def getPIDS(fname):
    f = open(fname, "r")
    found = re.findall("\/player\/(\d+)\/traditional\/\">(\w+ \w+|\w+-\w+ \w+|\w.\w. \w+|\w+ \w+-\w+)", f.read())
    print(found)
    # for i in found:
    #     print("Player: " + str(i[1]) + " ID:" + str(i[0]))
    return found


def getShotCharts(fname):
    # found = getPIDS(fname)
    players = [("2548","Dwyane_Wade"), ("201142","Kevin_Durant"), ("201939","Stephen_Curry"), ("203076","Anthony_Davis"),
               ("202681","Kyrie_Irving"), ("201566", "Russell_Westbrook"), ("2225","Tony_Parker"), ("2594","Kyle_Korver"), ("1713","Vince_Carter"), ("203954","Joel_Embiid")]
    for player in players:
        headers1 = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0'}
        params = {
            'PlayerID': player[0],
            'SeasonType': 'Regular Season',
            'Outcome' : '',
            'TeamID' : 0,
            'GameID' : '',
            'Month' : 0,
            'Location': '',
            'SeasonSegment': '',
            'DateFrom': '',
            'DateTo':'',
            'OpponentTeamID': 0,
            'VsConference' :'',
            'VsDivision': '',
            'PlayerPosition': '',
            'RookieYear':'',
            'GameSegment':'',
            'Period':0,
            'LastNGames':0,
            'ContextMeasure':'FGA'
        }
        params2 = {
            'PlayerID': player[0]
        }
        #response = requests.request("GET", shot_url, headers=headers, timeout=10)
        shot_response = requests.get("https://stats.nba.com/stats/shotchartdetail", params=params, headers=headers1, timeout=10)
        shot_headers = shot_response.json()['resultSets'][0]['headers']
        # Grab the shot chart data
        shots = shot_response.json()['resultSets'][0]['rowSet']
        shot_df = pd.DataFrame(shots, columns=shot_headers)
        shot_df.to_csv("../Resources/" +  player[1] +"_shots" + ".csv")

        info_response = requests.get("https://stats.nba.com/stats/commonplayerinfo", params=params2, headers=headers1, timeout=10)
        info_headers = info_response.json()['resultSets'][0]['headers']

        info = info_response.json()['resultSets'][0]['rowSet']
        info_df = pd.DataFrame(info, columns=info_headers)
        info_df.to_csv("../Resources/" +  player[1] +"info" + ".csv")
        # View the head of the DataFrame and all its columns
        # from IPython.display import display
        # with pd.option_context('display.max_columns', None):
        #     print(shot_df["GAME_DATE"])
    exit(1)

# getPIDS("playerIDS.txt")
getShotCharts("playerIDS.txt")