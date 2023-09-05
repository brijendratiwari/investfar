class AllUser {
    constructor(id,fullname,email,phone,address,avatar_url,property,status) {
      this.userid = id;
      this.fullname = fullname;
      this.email = email;
      this.phone = phone;
      this.address = address;
      this.profilePic = avatar_url,
      this.property = property,
      this.status = status
    }
  }

  module.exports = AllUser;