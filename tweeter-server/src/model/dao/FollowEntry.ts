export class FollowEntry {
  followerHandle: string;
  followeeHandle: string;
  followerName: string;
  followeeName: string;
  constructor(
    followerHandle: string,
    followeeHandle: string,
    followerName: string,
    followeeName: string
  ) {
    this.followerHandle = followerHandle;
    this.followeeHandle = followeeHandle;
    this.followerName = followerName;
    this.followeeName = followeeName;
  }
}
