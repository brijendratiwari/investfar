class Company {
    constructor(id,fullname, email,phone,address,avatar_url,status,type,offerService) {
      this.userid = id;
      this.fullname = fullname;
      this.email = email;
      this.phone = phone;
      this.address = address;
      this.profilePic = avatar_url,
      this.status = status,
      this.type = type,
      this.offerService = offerService
    }
  }

  module.exports = Company;