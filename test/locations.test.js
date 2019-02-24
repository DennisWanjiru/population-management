const Location = require("../src/db/models/Location");
const request = require("supertest");
MLAB_URI="mongodb://samjunior:Codeigniter1@ds263161.mlab.com:63161/population_test"
const app = require("../src/index");
const { execSync } = require("child_process");

let location_id;

const findSampleLocation = async () =>
  await Location.findOne({ name: "sample Test location" }).exec();

const deleteSampleParent = async () =>
await Location.deleteOne({ name: "sample Test location" }).exec();
const insertSample = ()=>{
    const correctLocation = {
        name: "not known place"+Date.now(),
        females: 43,
        males: 99
      };
      const sample = new Location(correctLocation)
      
      sample.save()
      return sample
}
const insertSample2 = ()=>{
    const correctLocation = {
        name: "sample 2",
        females: 43,
        males: 99
      };
      const sample = new Location(correctLocation)
      
      sample.save()
      return sample
}
const deleteUnknownParent = async () =>
  await Location.deleteOne({ name: "unknown place" }).exec();



beforeAll(async () => {

    await Location.collection.drop()
//   try {
//     const correctLocation = {
//       name: "sample Test location",
//       females: 43,
//       males: 99
//     };

//     const loc = findSampleLocation();

//     if (!!loc) {
//       location_id = loc._id;
//       return;
//     }
//     const stuff = await request(app)
//       .post("/api/locations/")
//       .send(correctLocation)
//       .set("Accept", "application/json");
//     location_id = stuff.body._id;

//     console.log("trhe location_id", location_id);
//   } catch (error) {
//     console.log(error);
//   }
});

afterAll(async () => {
  deleteSampleParent();
  deleteUnknownParent();
});
describe("Test Location Endpoints", () => {
  const missingName = {
    females: 43,
    males: 99
  };
  const missingFemale = {
    name: "unknown place",
    males: 99
  };

  const missingMale = {
    name: "unknown place",
    males: 99
  };
  const correctLocation = {
    name: "unknown place",
    females: 43,
    males: 99
  };
  it("should respond with json containing all contacts ", done => {
    return request(app)
      .get("/api/locations")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  it("respond with 400 Bad request with proper error message when name is missing", function(done) {
    request(app)
      .post("/api/locations")
      .send(missingName)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("respond with 400 Bad request with proper error message when females is missing", function(done) {
    request(app)
      .post("/api/locations")
      .send(missingFemale)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it("respond with 400 Bad request with proper error message when males is missing", function(done) {
    request(app)
      .post("/api/locations")
      .send(missingMale)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
  it("respond with 201 When all fields are provided", async function(done) {
    deleteUnknownParent();
    await request(app)
      .post("/api/locations")
      .send(correctLocation)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);
    done();
  });

  it("respond with 201 When all fields are provided in saving sublocation", async function(done) {
    deleteUnknownParent();
    await request(app)
      .post(`/api/locations/${location_id}/add`)
      .send(correctLocation)
      .set("Accept", "application/json");

    done();
  });

  it("should respond with 200 when deleting  location existing", done => {
    const inserted = insertSample()   
    console.log('th ', inserted)
    request(app)
      .delete(`/api/locations/${inserted._id}`)
      .then(res => {
          console.log('ze ', res.body)
        expect(res.statusCode).toBe(200);
        done();
      });
  });


  it("should respond with 200 when getting single slocation",async done => {
    const inserted = await insertSample()
    console.log('the inserted ',inserted)
    request(app)
      .get(`/api/locations/${inserted._id}`)
      .then(res => {
          console.log('the res', res.body)
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  it("should respond with 404 when deleting  location not existing", done => {
    request(app)
      .delete(`/api/locations/5c72b974d7c62d7e4aa3b23a`)
      .then(res => {
        expect(res.statusCode).toBe(404);
        done();
      });
  });

  it("should respond with 404 when updating location not existing", done => {
    request(app)
      .patch(`/api/locations/5c72b974d7c62d7e4aa3b53a`)
      .then(res => {
        expect(res.statusCode).toBe(404);
        done();
      });
  });

  it("should respond with 200 when updating location existing",async (done) => {
    const inserted = await insertSample()
    request(app)
      .patch(`/api/locations/${inserted._id}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });



});
