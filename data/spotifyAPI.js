export const spotifyAPI = (function() {
    
    //our specific client id and secret!!
    const clientId = '0e5c2d2170cc49219d0d64b2e38ae77b';
    const clientSecret = '40891fae309f4b5892e1812e9f5d547c';

    //generates token for us, the token changes every hour so it needs to go through the spotify api everytime
    const getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
  
    const getAlbum = async (albumName) => {
        const token = await spotifyAPI.getToken();
        const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        const albums = data.albums.items.map(album => [album.name, album.artists[0].name, album.id]);
        return albums;
    }

  const getAlbumInfo = async (albumName) => {
    const token = await getToken();
    const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();

    if (!data.albums || !data.albums.items || data.albums.items.length === 0) {
        console.error('Invalid album information or missing artists.');
        return null;
    }
    const albums = data.albums.items.map(album => album);
    return albums;
}


  const getAlbumName = async (albumName) => {
      const token = await spotifyAPI.getToken();
      const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
      });

      const data = await result.json();
      const albumNames = data.albums.items.map(album => album.name); 
      return albumNames;
  }

  const getAlbumArtist = async (albumName) => {
      const token = await spotifyAPI.getToken();
      const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
      });

      const data = await result.json();
      const artistNames = data.albums.items.map(album => album.artists[0].name); // Modify to return an array of artist names
      return artistNames;
  }

  return {
    getToken,
    getAlbumInfo,
    getAlbumName,
    getAlbumArtist,
    getAlbum
  }
  })();


export const getAlbumObject = async (albumID) => {
    const token = await spotifyAPI.getToken();
    const result = await fetch(`https://api.spotify.com/v1/albums/${encodeURIComponent(albumID)}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    // if(typeof(result) != 'array'){
    //   throw new Error('Invalid album ID');
    // }

    const firstAlbum = await result.json();
    if(firstAlbum['error']){
      throw new Error('Invalid album ID');
    }
    
    const name = firstAlbum.name;
    const artistName = firstAlbum.artists[0].name;
    // const genres = firstAlbum.genres;
    const totalTracks = firstAlbum.total_tracks;
    const albumType = firstAlbum.album_type;
    const albumCover = firstAlbum.images;

    // getting artist genre
    let artist_genre;
    let artist_id = firstAlbum.artists[0].id;
    const res = await fetch(`https://api.spotify.com/v1/artists/${encodeURIComponent(artist_id)}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const artist_info = await res.json();
    artist_genre = artist_info.genres;

    return {
        albumName: name,
        artistNames: artistName,
        genres: artist_genre,
        totalTracks: totalTracks,
        albumType: albumType,
        albumCover: albumCover,
        avgranking: null
    }
}


//how to use:
//const token = await spotifyAPI.getToken();
const albumName = "Pink Friday 2"; // Replace with the desired album name
const albumArtist = 'Nicki Minaj';
const albumInfo = await getAlbumObject('5eA2VJ0yeiU4kXz1zvuMro');
const currentAlbumName= albumInfo.albumName;

// console.log(currentAlbumName)
// const alb = await getAlbumObject('7D8GwKhqPfHGG9zmz8U6Eq');
// console.log(alb);

// const albumss = await spotifyAPI.getAlbum("hello");
// console.log(albumss);


  
//the specs, important ones to keep note of : name, images

/*
{
  "album_type": "compilation",
  "total_tracks": 9,
  "available_markets": ["CA", "BR", "IT"],
  "external_urls": {
    "spotify": "string"
  },
  "href": "string",
  "id": "2up3OPMp9Tb4dAKM2erWXQ",
  "images": [
    {
      "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      "height": 300,
      "width": 300
    }
  ],
  "name": "string",
  "release_date": "1981-12",
  "release_date_precision": "year",
  "restrictions": {
    "reason": "market"
  },
  "type": "album",
  "uri": "spotify:album:2up3OPMp9Tb4dAKM2erWXQ",
  "artists": [
    {
      "external_urls": {
        "spotify": "string"
      },
      "href": "string",
      "id": "string",
      "name": "string",
      "type": "artist",
      "uri": "string"
    }
  ],
  "tracks": {
    "href": "https://api.spotify.com/v1/me/shows?offset=0&limit=20",
    "limit": 20,
    "next": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",
    "offset": 0,
    "previous": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",
    "total": 4,
    "items": [
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "string"
            },
            "href": "string",
            "id": "string",
            "name": "string",
            "type": "artist",
            "uri": "string"
          }
        ],
        "available_markets": ["string"],
        "disc_number": 0,
        "duration_ms": 0,
        "explicit": false,
        "external_urls": {
          "spotify": "string"
        },
        "href": "string",
        "id": "string",
        "is_playable": false,
        "linked_from": {
          "external_urls": {
            "spotify": "string"
          },
          "href": "string",
          "id": "string",
          "type": "string",
          "uri": "string"
        },
        "restrictions": {
          "reason": "string"
        },
        "name": "string",
        "preview_url": "string",
        "track_number": 0,
        "type": "string",
        "uri": "string",
        "is_local": false
      }
    ]
  },
  "copyrights": [
    {
      "text": "string",
      "type": "string"
    }
  ],
  "external_ids": {
    "isrc": "string",
    "ean": "string",
    "upc": "string"
  },
  "genres": ["Egg punk", "Noise rock"],
  "label": "string",
  "popularity": 0
}
*/



/* after making all the functions for like getName and getCover can we fill in this function to export into musicdata
export const albumInfo = async (albumName) => {
  token = await spotifyAPI.getToken();
  info = await spotifyAPI.getAlbum(token, albumName);
  return {
    albumName: info.name,
    artistNames: 
    genres: 
    totalTracks: 
    albumType:
    albumCover: 
  }
}
*/ 

