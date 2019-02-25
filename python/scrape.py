import re
import pandas as pd
import requests
import urllib.request


def getPIDS(fname):
    f = open(fname, "r")
    found = re.findall("\/player\/(\d+)\/traditional\/\">(\w+ \w+|\w+-\w+ \w+|\w.\w. \w+|\w+ \w+-\w+)", f.read())
    # print(found)
    for i in found:
        print("Player: " + str(i[1]) + " ID:" + str(i[0]))
    return found


def getShotCharts(fname):

    found = getPIDS(fname)
    print("no here")
    for player in found:
        print(player[0])
        headers1 = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0'}
        params = {
            'PlayerID': str(player[0]),
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
        #response = requests.request("GET", shot_url, headers=headers, timeout=10)
        response = requests.get("https://stats.nba.com/stats/shotchartdetail", params=params, headers=headers1, timeout=10)
        headers = response.json()['resultSets'][0]['headers']
        # Grab the shot chart data
        shots = response.json()['resultSets'][0]['rowSet']
        shot_df = pd.DataFrame(shots, columns=headers)
        # View the head of the DataFrame and all its columns
        #print("yo")
        from IPython.display import display
        with pd.option_context('display.max_columns', None):
            print(shot_df["GAME_DATE"])
        break
getPIDS("playerIDS.txt")
#getShotCharts("playerIDS.txt")