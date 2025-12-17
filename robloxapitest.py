import requests
import json

def getUserData(username):
    url = "https://users.roblox.com/v1/usernames/users"
    request = {
        "usernames" : [username],
        "excludeBannedUsers" : True
    }

    response = requests.post(url,json=request)
    data = response.json()

    if "data" in data:
        return data["data"][0]
    else:
        print(response.status_code)
        return None
    
def addAvatarHeadShots(playerData):
    
    url = "https://thumbnails.roblox.com/v1/batch"

    requestBatches = [[],[]]

    firstUpperBound = len(playerData)
    if len(playerData) > 100:
        firstUpperBound = 100

    for i in range(0,firstUpperBound):
        requestBatches[0].append({
            "requestId": str(playerData[i]["id"]),
            "targetId": playerData[i]["id"],
            "type": "AvatarHeadShot",
            "size": "150x150",
            "isCircular": True,
        })
    
    if len(playerData) > 100:
        for i in range(100,100 + (len(playerData)-100)):
            requestBatches[1].append({
                "requestId": str(playerData[i]["id"]),
                "targetId": playerData[i]["id"],
                "type": "AvatarHeadShot",
                "size": "150x150",
                "isCircular": True,
            })

    count = 0
    for i in range(0,len(requestBatches)):
        if len(requestBatches[i]) == 0:
            continue
        
        response = requests.post(url,json=requestBatches[i])
        data = response.json()
        
        if "data" in data:
            for user in data["data"]:
                playerData[count]["headShotId"] = user["imageUrl"]
                count += 1
    

#     [
#   {
#     "requestId": "3670381983",
#     "targetId": 3670381983,
#     "type": "AvatarHeadShot",
#     "size": "150x150",
#     "isCircular": true,
#     "accessContext": "string"
#   },
#   {
#     "requestId": "516259271",
#     "targetId": 516259271,
#     "type": "AvatarHeadShot",
#     "size": "150x150",
#     "isCircular": true,
#     "accessContext": "string"
#   }
# ]


    
def getFriendsData(rawFriendsData):


    url = "https://users.roblox.com/v1/users"

    userIds = []

    for friend in rawFriendsData:
        userIds.append(friend["id"])

    request = {
        "userIds" : userIds,
    }

    response = requests.post(url,json=request)
    data = response.json()

    if "data" in data:
        return data["data"]
    else:
        print(response.status_code)
        return None

def getFriends(username):

    userData = getUserData(username)
    if userData == None:
        return

    userId = userData["id"]

    url = f"https://friends.roblox.com/v1/users/{userId}/friends"

    response = requests.get(url)
    data = response.json()

    if "data" in data:
        print(len(data["data"]))
        return data["data"],userId
    else:
        print(response.status_code)
        return None
    
    
def displayList(playerList):
    # for user in playerList:
    #     print(user["name"] + "'s display name: " + user["displayName"] + ", userID: " + str(user["id"]))
    #     print("image id: " + user["headShotId"])

    print("number of friends:")
    print(len(playerList))

targetUsername = "dovx_r3vevr"
friendsRaw,userID = getFriends(targetUsername)
friendsData = getFriendsData(friendsRaw)
addAvatarHeadShots(friendsData)
displayList(friendsData)

