import express from 'express'
import mongoose, { Schema } from "mongoose";
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser';
dotenv.config()
import router from './routes/users.js'
import connect from './database/database.js'
// import Racer from './model/racer.js'
let app = express()
let port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const raceResultSchema = new mongoose.Schema({
  raceName: String,
  racerPoints: [
    {
      racer: {
        type: Schema.Types.ObjectId,
        ref: 'racer'
      },
      point: Number
    },
  ],
});

const racerSchema = new mongoose.Schema({
  name: String,
  country: String
});

const race = new mongoose.Schema({
  raceName: String,
  country: String
});

const Points = mongoose.model('points', raceResultSchema);
const Racer = mongoose.model('racer', racerSchema);
const Race = mongoose.model('race', race);

connect()
  .then(async () => {
    app.get('/api/racer', async (req, res) => {
      try {
        const racer = await Racer.find({});
    
        if (racer.length === 0) {
          return res.status(404).json({ error: 'Race result not found' });
        }
        console.log('racer', racer)
        const filteredArray = racer.map(obj => {
          return {
            racer: obj._id,
            point: 0}
        });
        
        res.json(racer);
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });
    app.post('/api/racer', async (req, res) => {
      try {
        console.log('req', req.params, req.body, req.query)
        const racer = new Racer(req.body);
        await racer.save()
        res.json(racer);
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });
    app.post('/api/race', async (req, res) => {
      try {
        console.log('req', req.params, req.body, req.query)
        const racer = new Race(req.body);
        await racer.save()
        res.json(racer);
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });
    app.post('/api/points', async (req, res) => {
      try {
        console.log('req', req.body)
        const racePoints = new Points(req.body);
        await racePoints.save()
        res.json(racePoints);
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });

    app.get('/api/points', async (req, res) => {
      try {
        const racePoints = await Points.find({})
          .populate('racerPoints.racer', ['name', 'country'])
        
        let result = {}
        racePoints.forEach(e => {
          console.log(e)
          // result[e.raceName] = {}
          e.racerPoints.forEach(r => {
            // console.log('racerPoints', r)
              result[r.racer.name] = result[r.racer?.name] || {}
              result[r.racer.name][e.raceName] = r.point
              result[r.racer.name]["country"] = r.racer.country
          })
        })
        
        let ress = []
        console.log('RacePoints:', result)
        
        Object.keys(result).forEach(k => {
          ress.push({
            racer: k,
            ...result[k]
          })
        })

        let LOCATIONS = [];
        const data = ress.map((data, index) => {
          // console.log(data);
          if (index === 0) {
            LOCATIONS = Object.keys(data).filter(key => key !== 'racer' && key !== 'country');
          }
          let points = 0
          LOCATIONS.forEach(location => {
            points += data?.[location] ?? 0;
          })
          data.point = points;
          return data;
        })
        data.sort((a, b) => b.point - a.point);
        for (let i = 0; i < data.length - 1; i++) {
          data[i + 1].leader = Math.abs(data[0].point - data[i + 1].point);
          data[i + 1].previous = Math.abs(data[i].point - data[i + 1].point);
        }
        
        console.log(data)
        res.json(data);
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });
    
    app.listen(3000, () => {
      console.log("Ứng dụng Express.js đang lắng nghe trên cổng 3000");
    });
  })
  .catch((error) => {
    console.error("Lỗi kết nối đến cơ sở dữ liệu:", error);
  });
