const {exec, spawn} = require("child_process");
const express = require('express');
const WebTorrent = require('webtorrent-hybrid');

// const {handleRes} = require("./utility");
const router = express.Router();

const client = new WebTorrent({
    destroyStoreOnDestroy: false,
    maxConns: 100,        // Max number of connections per torrent (default=55)
    utp: true,            // Enable BEP29 uTorrent transport protocol (default=false)

});
client.on("error", (e)=>{
    console.error("ERROR ON CLIENT: ",e)
})

router.post('/add', (req, res, next) => {
    /*
        #swagger.tags = ['Downloads']
        #swagger.summary = "Add a torrent to the list"
        #swagger.parameters['torrent'] = {
            in: 'body',
            description: 'Add a torrent',
            schema: {
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }
         }
         #swagger.responses[200] = {
        description: "A single torrent information",
        schema: [{
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }]
        }
    */
    console.debug('Body:', req.app.locals.storage.getDownload());
    client.add(req.body.magnet, {path: req.app.locals.storage.getDownload()});
    res.status(200).json(req.body);
});
router.post('/pause', (req, res, next) => {
    /*
        #swagger.tags = ['Downloads']
        #swagger.summary = "Pause a torrent in the list"
        #swagger.parameters['torrent'] = {
            in: 'body',
            description: 'Pause a torrent',
            schema: {
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }
         }
         #swagger.responses[200] = {
        description: "A single torrent information",
        schema: [{
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }]
        }
    */
    console.debug('Body:', req.body);
    client.get(req.body.magnet).pause();
    res.status(200).json(req.body);
});

router.get('/check-status', (req, res, next) => {
    /*
        #swagger.tags = ["Downloads"]
        #swagger.summary = "Check the status of the torrents"
        #swagger.description = "It returns all the detail about the torrent",
        #swagger.responses[200] = {
        description: "A single torrent information",
        schema: [{
                $name: x.name,
                $magnet: x.magnetURI,
                $downloaded: x.downloaded,
                $uploaded: x.uploaded,
                $downloadSpeed: x.downloadSpeed,
                $uploadSpeed: x.uploadSpeed,
                $progress: x.progress,
                $ratio: x.ratio,
                $path: x.path,
                $done: x.done
            }]
        }
    }
    */
    res.status(200).json(client.torrents.map(x => {
        return {
            name: x.name,
            infoHash: x.infoHash,
            magnet: x.magnetURI,
            downloaded: x.downloaded,
            uploaded: x.uploaded,
            downloadSpeed: x.downloadSpeed,
            uploadSpeed: x.uploadSpeed,
            progress: x.progress,
            ratio: x.ratio,
            path: x.path,
            done: x.done,
            paused: x.paused,
        }
    }))
});

router.post('/destroy', (req, res, next) => {
    /*
        #swagger.tags = ['Downloads']
        #swagger.summary = "Remove a torrent in the list"
        #swagger.parameters['torrent'] = {
            in: 'body',
            description: 'Remove a torrent and destroy data',
            schema: {
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }
         }
         #swagger.responses[200] = {
        description: "A single torrent information",
        schema: [{
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }]
        }
    */
    console.debug('Body:', req.body);
    client.get(req.body.magnet).destroy({destroyStore: true});
    res.status(200).json(req.body);
});


router.post('/remove', (req, res, next) => {
    /*
        #swagger.tags = ['Downloads']
        #swagger.summary = "Remove a torrent in the list, keeping the data"
        #swagger.parameters['torrent'] = {
            in: 'body',
            description: 'Remove a torrent and keep data',
            schema: {
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }
         }
         #swagger.responses[200] = {
        description: "A single torrent information",
        schema: [{
                $magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
            }]
        }
    */
    console.debug('Body:', req.body);
    client.get(req.body.magnet).destroy();
    res.status(200).json(req.body);
});

router.post('/list', (req, res, next) => {
    /*
        #swagger.tags = ["Downloads"]
        #swagger.summary = "Check the status of the torrents"
        #swagger.description = "It returns all the detail about the torrent",
        #swagger.responses[200] = {
        description: "A single torrent information",
        schema: [{
                $name: x.name,
                $magnet: x.magnetURI,
                $downloaded: x.downloaded,
                $uploaded: x.uploaded,
                $downloadSpeed: x.downloadSpeed,
                $uploadSpeed: x.uploadSpeed,
                $progress: x.progress,
                $ratio: x.ratio,
                $path: x.path,
                $done: x.done
            }]
        }
    }
    */
    res.status(200).json(client.torrents.map(x => {
        return {
            name: x.name,
            infoHash: x.infoHash,
            magnet: x.magnetURI,
            downloaded: x.downloaded,
            uploaded: x.uploaded,
            downloadSpeed: x.downloadSpeed,
            uploadSpeed: x.uploadSpeed,
            progress: x.progress,
            ratio: x.ratio,
            path: x.path,
            done: x.done,
            paused: x.paused,
        }
    }))
});

module.exports = router;
