// import {
//   instance,
//   mock,
//   verify,
//   spy,
//   when,
//   anything,
// } from "@typestrong/ts-mockito";
// import { StatusService } from "../../../src/components/services/StatusService";
// import { AuthToken, User } from "tweeter-shared";
// import "isomorphic-fetch";

// describe("StatusService", () => {
//   const statusService = new StatusService();
//   const authToken = new AuthToken("token", Date.now());
//   let allen: User;
//   let amy: User;

//   beforeAll(() => {
//     allen = new User(
//       "Allen",
//       "Anderson",
//       "@allen",
//       "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
//     );
//     amy = new User(
//       "Amy",
//       "Ames",
//       "@amy",
//       "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
//     );
//   });

//   it("gets a list of story items (statuses) and a boolean hasMore", async () => {
//     const [statuses, lastItem] = await statusService.getStoryItems(
//       authToken,
//       "@bob",
//       2,
//       null
//     );
//     expect(statuses).toBeDefined();
//     expect(statuses.length).toBe(2);
//     expect(statuses[0]).toBeDefined();
//     expect(statuses[1]).toBeDefined();
//     expect(statuses[0].user).toBeDefined();
//     expect(statuses[0].user).toEqual(allen);
//     expect(statuses[1].user).toBeDefined();
//     expect(statuses[1].user).toEqual(amy);
//     expect(statuses[0].post).toBeDefined();
//     expect(statuses[0].post).toEqual(expect.any(String));
//     expect(statuses[1].timestamp).toBeDefined();
//     expect(statuses[1].timestamp).toEqual(expect.any(Number));
//   });
// });
