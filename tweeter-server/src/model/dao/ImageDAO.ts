export interface ImageDAO {
  putImage: (
    filename: string,
    userImageBytes: Base64URLString
  ) => Promise<string>;
}
