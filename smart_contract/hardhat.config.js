require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/gnJccgWBDSywiyw8LpdYeM7cDJwabW71",
      accounts: ["efd43ad527171d929b5935dc0aab32b49258bb2ed2b3a930ebdb3722d38c5505"],
    },
  },
};
