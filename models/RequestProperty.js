class RequestProperty {
    constructor(id,fullname,email,phone,avatar_url,status,createdAt,message,image,name) {
      this.userid = id;
      this.fullname = fullname;
      this.email = email;
      this.phone = phone;
      this.profilePic = avatar_url,
      this.status = status,
      this.createdAt = createdAt,
      this.message = message,
      this.image = image,
      this.name = name
    }
  }

  module.exports = RequestProperty;