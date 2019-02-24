const Location = require("../src/db/models/Location");
const request = require("supertest");
MLAB_URI =
  "mongodb://samjunior:Codeigniter1@ds247698.mlab.com:47698/population_management";
const app = require("../src/index");
const { execSync } = require("child_process");

let location_id;

const findSampleLocation = async () =>
  await Location.findOne({ name: "sample Test location" }).exec();

const deleteSampleParent = async () =>
  await Location.deleteOne({ name: "sample Test location" }).exec();
const insertSample = ()=>{
    const correctLocation = {
        name: "not known place",
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
  try {
    const correctLocation = {
      name: "sample Test location",
      females: 43,
      males: 99
    };

    const loc = findSampleLocation();

    if (!!loc) {
      location_id = loc._id;
      return;
    }
    const stuff = await request(app)
      .post("/api/locations/")
      .send(correctLocation)
      .set("Accept", "application/json");
    location_id = stuff.body._id;

    console.log("trhe location_id", location_id);
  } catch (error) {
    console.log(error);
  }
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

//   it("should respond with 200 when deleting  location existing", done => {
//     const inserted = insertSample()

//     request(app)
//       .delete(`/api/locations/${inserted._id}`)
//       .then(res => {
//         expect(res.statusCode).toBe(200);
//         done();
//       });
//   });

  it("should respond with 404 when deleting  location not existing", done => {
    request(app)
      .delete(`/api/locations/5c72b974d7c62d7e4aa3b53a`)
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

//   it("should respond with 200 when updating  existing location ", done => {
//     //   const id = insertSample()._id
//     console.log("sampo ", insertSample())
//     const id = 32
//     request(app)
//       .patch(`/api/locations/${id}`)
//       .then(res => {
//           console.log("the res ", res)
//         expect(res.statusCode).toBe(4304);
//         done();
//       });
//   });

  //     it('should respond with 404 when deleting  location not existing', (done) => {
  //       request(app).delete(`/api/locations/${location_id}`).then(res=>{
  //         expect(response.statusCode).toBe(404)
  //                 done()
  //       });
  //   });

  // });
  // it('should respond with 404 when searching for contact not existing',(done) => {
  //     return request(app).get("/contacts/32").then(response => {
  //         expect(response.statusCode).toBe(404)
  //         done()
  //     },10000)
  // });
  // });
  // it('should respond with 404 when searching for contact not existing',(done) => {
  //     return request(app).get("/contacts/42").then(response => {
  //         expect(response.statusCode).toBe(404)
  //         done()
  //     },10000)
  // });
  // it('should respond with 404 when searching for contact not existing',(done) => {
  //     return request(app).get("/contacts/432").then(response => {
  //         expect(response.statusCode).toBe(404)
  //         done()
  //     },10000)
  // });
  // it('should respond with 404 when deleting  contact not existing',(done) => {
  //     return request(app).delete("/contacts/432").then(response => {
  //         expect(response.statusCode).toBe(404)
  //         done()
  //     },10000)
  // });

  //    let missingPhone = {
  //     "name": "dummy",
  //     id:19,
  // }

  //    let missingName = {
  //     "phone": "02938439854899845",
  //     id:24,
  // }
  // const correctData = {
  //     id:1000,
  //   name:"awesomeness",
  //   phone:"5900893540984598009"
  // }
  // const incorrectData = {
  //     id:3,
  //   name:"awesomeness",
  //   phone:"5900893540984598009"
  // }

  // it('respond with 400 Bad request with proper error message when phone is missing', function (done) {
  //     request(app)
  //         .post('/contacts')
  //         .send(missingPhone)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(400)
  //         .expect(res=> res.body.message === "Phone field is required")
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
  // });

  // it('respond with 201 When correct data is provided', function (done) {
  //     request(app)
  //         .post('/contacts')
  //         .send(correctData)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(201)
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
});

//SMS TESTS
describe("SMS TESTS", () => {
  //   const fakeMessage = {
  //     status:"849",
  //     id:29,
  //   }
  //   const fakeStatus = {
  //     "message":"this is awessome",
  //     id:433,
  //   }
  //   const missingSenderId = {
  //     status:"unread",
  //     message:"this is awe",
  //     id:65,
  //   }
  //   const missingReceiverId = {
  //     status:"unread",
  //     message:"this is awe",
  //     senderId:1000,
  //     id:65,
  //   }
  //   const correctMessage = {
  //     status:"unread",
  //     message:"this is awe",
  //     senderId:1000,
  //     receiverId:1000,
  //     id:10001,
  //   }
  //   const correctWithoutStatus = {
  //     message:"this is awe",
  //     senderId:1000,
  //     receiverId:1000,
  //     id:10003,
  //   }
  //     it('respond with 400 Bad request with proper error message when message field is missing', function (done) {
  //     request(app)
  //         .post('/messages')
  //         .send(fakeMessage)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(400)
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
  // });
  //     it('add status by default if it is not in the list ', function (done) {
  //     request(app)
  //         .post('/messages')
  //         .send(fakeStatus)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(400)
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
  // });
  //     it('throw an error when sender id is missing ', function (done) {
  //     request(app)
  //         .post('/messages')
  //         .send(missingSenderId)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(400)
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
  // });
  //     it('throw an error when receiver id is missing ', function (done) {
  //     request(app)
  //         .post('/messages')
  //         .send(missingReceiverId)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(400)
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
  // });
  //     it('respond with 201 When correct data is provided', function (done) {
  //     request(app)
  //         .post('/messages')
  //         .send(correctMessage)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(201)
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
  // });
  //     it('adds status as read if it is empty', function (done) {
  //     request(app)
  //         .post('/messages')
  //         .send(correctWithoutStatus)
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(201)
  //         .end((err) => {
  //             if (err) return done(err);
  //             done();
  //         });
  // });
  //     it('should respond with 404 when bad id is provided single message ',(done) => {
  //     return request(app).get("/messages/32").then(response => {
  //         expect(response.body.message).toBe("Sms with ID 32 was not found")
  //         done()
  //     },10000)
  // });
  //     it('should respond with 404 when bad id is provided single message ',(done) => {
  //     return request(app).get("/messages/sent/54").then(response => {
  //         expect(response.statusCode).toBe(404)
  //         expect(response.body.message).toBe("No sms from a sender with id 54")
  //         done()
  //     },10000)
  // });
  //     it('should respond with 404 when bad id is provided single message ',(done) => {
  //     return request(app).get("/messages/received/65").then(response => {
  //         expect(response.statusCode).toBe(404)
  //         done()
  //     },10000)
  // });
  //     it('Deletion should respond with 404 when bad id is provided single message ',(done) => {
  //     return request(app).delete("/messages/42").then(response => {
  //         expect(response.statusCode).toBe(404)
  //         done()
  //     },10000)
  // });
  //     it('should respond with 200 when correct id is provided ',(done) => {
  //     return request(app).get("/messages/received/1000").then(response => {
  //         expect(response.statusCode).toBe(200)
  //         done()
  //     },10000)
  // });
});
