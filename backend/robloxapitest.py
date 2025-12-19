import requests
import json
import time
import sys


def printRateLimits(functionName : str,response : requests.Response):
    print(functionName + " rate limit info:")
    print("Total rate limit:",response.headers.get("x-ratelimit-limit"))
    print("Requests remaining:",response.headers.get("x-ratelimit-remaining"))
    print("Resetting in:",response.headers.get("x-ratelimit-reset"))

    if response.status_code == 429:
        print("429 hit rate limit for: " + functionName)
        print(response.text)

# if hit rate limit, we will get the number of seconds until roblox's quota resets wait wait that much time.
# if there is no timer or the timer is suspiciously low (say under 10 seconds), 
# just fall back to exponential backoff. 
# Roblox cloud api sometimes does this weird thing where it gives you a fake cooldown time.
def adaptiveRetry(functionName : str ,url : str, request):

    maxRetries = 6
    attempts = 0

    while attempts < maxRetries:
        response = requests.post(url,json=request)
        data = response.json()

        # printRateLimits(f"{functionName} batch",response)

        if "data" in data:
            print(f"{functionName} was successful, returning")
            return data["data"]
        elif response.status_code == 429:
            waitTimeStr = response.headers.get("x-ratelimit-reset")
            waitTime = 3 ** attempts

            if waitTimeStr and int(waitTimeStr) > 10:
                waitTime = int(waitTimeStr) + 1
                print(f"hit rate limit for {functionName}, waiting {int(waitTime)} seconds")
            else:
                #falling back to exponential backoff if waitTime is not available
                print(f"hit rate limit for {functionName}, falling back to exp retry, waiting {waitTime} seconds")
            
            time.sleep(int(waitTime))
            attempts += 1
        else:
            print(f"error: {response.status_code}, {response.text}")
            break

# the same function from above but just using requests.get instead of requests.post
def adaptiveRetryGet(functionName : str, url : str):

    maxRetries = 6
    attempts = 0

    while attempts < maxRetries:
        response = requests.get(url)
        data = response.json()

        # printRateLimits(functionName,response)

        if "data" in data:
            return data["data"]
        elif response.status_code == 429:
            waitTimeStr = response.headers.get("x-ratelimit-reset")
            waitTime = 3 ** attempts

            if waitTimeStr and int(waitTimeStr) > 10:
                waitTime = int(waitTimeStr) + 1
                print(f"hit rate limit for {functionName}, waiting {int(waitTime)} seconds")
            else:
                #falling back to exponential backoff if waitTime is not available
                print(f"hit rate limit for {functionName}, falling back to exp retry, waiting {waitTime} seconds")
            
            time.sleep(int(waitTime))
            attempts += 1
        else:
            print(f"error: {response.status_code}, {response.text}")
            break  
    
# this is used when the user first enters a username to begin
def getUserData(username):
    url = "https://users.roblox.com/v1/usernames/users"
    request = {
        "usernames" : [username],
        "excludeBannedUsers" : True
    }

    return adaptiveRetry("getUserData",url,request)
    
# gets the links of all the friends of a specific username
# thumbnails.roblox.com/v/batch only allows 100 users per request so we will be doing batches for every 100 users
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
        for i in range(100,len(playerData)):
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

        data = adaptiveRetry(f"addAvatarHeadshots batch {i}",url,requestBatches[i])
        
        if data:
            for user in data:
                playerData[count]["headShotId"] = user["imageUrl"]
                count += 1

# gets the data of all the friends of a specific user. rawFriendsData only holds each friend's user id,
# so we need to get each friend's name and displayname.
def getFriendsData(rawFriendsData):

    url = "https://users.roblox.com/v1/users"

    batches = [[],[]]
    returnData = []

    firstUpperBound = len(rawFriendsData)
    if len(rawFriendsData) > 100:
        firstUpperBound = 100

    for i in range(0,firstUpperBound):
        batches[0].append(rawFriendsData[i]["id"])

    if len(rawFriendsData) > 100:
        for i in range(100,len(rawFriendsData)):
            batches[1].append(rawFriendsData[i]["id"])
    
    for batch in batches:

        if len(batch) == 0:
            continue

        request = {
            "userIds" : batch,
        }

        data = adaptiveRetry(f"getFriendsData (batch)",url,request)
        
        if data:
            returnData = returnData + data
        else:
            print("data is not there")

    return returnData

# gets the userIds of all the friends of a specific username
def getFriends(username):

    userData = getUserData(username)
    if userData == None:
        return

    userId = userData[0]["id"]

    url = f"https://friends.roblox.com/v1/users/{userId}/friends"

    return adaptiveRetryGet("getFriends",url)
    
    
def displayList(playerList):
    for user in playerList:
        print(user["name"] + "'s display name: " + user["displayName"] + ", userID: " + str(user["id"]))
        print("image id: " + user["headShotId"])

    print("number of friends:")
    print(len(playerList))

targetUsername = "ZMayer1234"
friendsRaw = getFriends(targetUsername)
if friendsRaw == None:
    sys.exit()
friendsData = getFriendsData(friendsRaw)
if friendsData == None:
    
    sys.exit()
addAvatarHeadShots(friendsData)
displayList(friendsData)

