const request = require("supertest");
const app = require("../../app");
const { response } = require("../../app");

describe("test GET launches", () => {
  test("it should return response status code 200", async () => {
    const response = await request(app)
      .get("/launches")
      .expect(200)
      .expect("Content-Type", /json/);
    // expect(response.statusCode).toBe(200);
  });
});

describe("test POST launches", () => {
  const completeLaunchData = {
    mission: "USS Enterprice",
    rocket: "NCC 1772",
    target: "Kepler 186-F",
    launchDate: "January 4, 2028",
  };

  const launchDataWithoutDate = {
    mission: "USS Enterprice",
    rocket: "NCC 1772",
    target: "Kepler 186-F",
  };

  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect(201)
      .expect("Content-Type", /json/);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(response.body).toMatchObject(launchDataWithoutDate);
    expect(requestDate).toBe(responseDate);
  });

  test("it should check missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body).toStrictEqual({
      error: "Missing Required Properties of mission",
    });
  });

  test("it should check invalid date", () => {});
});
