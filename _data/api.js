//remove the comments when you have wired up the API
require("dotenv").config();
const superagent = require("superagent");

//async function to get the posts
getData = async () => {
  let method = "test-endpoint/";
  console.log(`${process.env.STRAPIAPI}${method}`);
  var res = await superagent
    .get(`${process.env.STRAPIAPI}backpage-projects/`)
    .query({});
  //console.log(res.body)
  return res.body;
};

// if (resArray.length === 0) resArray = await getData();
//fake it until you make it we dont want to do a api call but we do want to test the rendering so there we have it.

const workList = [
  {
    className: "outerOrbit",
    title: "Outer Orbit",
    subTitle: "Proof of Concept",
    summary:
      "OrbitLabs launched OuterOrbit as a proof of concept marketplace with unique collections, fast transactions, and low gas fees.",
    href: "",
    image: "outer-banner.png",
    code: "",
    pageName: "outer",
    content:
      "OrbitLabs launched OuterOrbit as a proof of concept marketplace for unique collections of products. It uses Tomochain, a high-performance public blockchain that can handle over 2,000 transactions per second. The company aims to provide an alternative to OpenSea by offering a decentralized marketplace without middleman fees. This project is actively developed and will become more robust with each update.",
  },
  {
    className: "ultimateKricketChallenge",
    title: "Ultimate Kricket Challenge",
    subTitle: "Product Build & Brand Identity",
    summary:
      "The Ultimate Kricket Challenge is an action-packed tournament for the world's elite cricket players.",
    href: "https://ukccrypto.com/",
    image: "ukc-banner.png",
    code: "",
    pageName: "ukc",
    content:
      "The Ultimate Kricket Challenge is powered by blockchain technology to record all data related to the tournament. The platform aims to provide transparency and accountability in cricket. The UKC team approached OrbitLabs to add blockchain to their website. The idea is to use blockchain technology as a way of providing provenance and ownership for each car.",
  },
  {
    className: "clasiq",
    title: "CLASIQ",
    subTitle: "Blockchain Integration",
    summary: "The world's most trusted auction for classic car enthusiasts.",
    href: "https://www.clasiq.com/",
    image: "clasiq-banner.jpg",
    code: "",
    pageName: "clasiq",
    content:
      "Clasiq is a marketplace for the classic car industry. It allows people to trade and buy cars with cryptocurrencies, as well as store them in a secure, decentralized environment. OrbitLabs extended Clasiq to use crypto to create an initial immutable point of reference for every asset and track ownership over time. The solution was built on the BSC blockchain, which has been designed specifically for smart contracts and other applications requiring high levels of security. We use BSC to store digital representations of physical cars that pass through the Clasiq platform. The blockchain provides provenance and ownership for each car, making it easy to track ownership and provenance.",
  },
  {
    className: "planetOMO",
    title: "PLANETOMO",
    subTitle: "Proof of Concept | Blockchain | GameFi | NFT",
    summary: "The click to earn game on tomochain",
    href: "https://planetomo.com/",
    image: "planetTomoBanner.png",
    code: "",
    pageName: "planetomo",
    content:
      "Planetomo is an experiment in creating a play to win in the crypto space. Our data-driven approach gives us an edge in finding the best opportunities possible. We’re excited to share more with you as we continue to learn more about the space and grow Planetomo into something meaningful and valuable to our users, partners, and investors. We built the presentation layer of the game separately so with the game engine, we can build just about any game you can imagine on top of it. If you have an idea for a game that would work well on Planetomo and would like to help us build it, please reach out. We’re not looking for clones but unique games that are fun and entertaining.",
  },
  {
    className: "buildingBlock",
    title: "BUILDING BLOCK",
    subTitle: "Proof of Concept | Blockchain | Property",
    summary: "Manage properties on the blockchain",
    href: "https://bb.orbitlabs.xyz/",
    image: "BuildingBlockBanner.jpg",
    code: "https://github.com/OrbitLabsDAO/buildingblocksreporting",
    pageName: "buildingblock",
    content:
      "At OrbitLabs, we think crypto will have a big part in property ownership and management in the future. We built a management framework with the following assumptions: in the context of property ownership, cryptocurrencies could potentially be used to facilitate the buying and selling of real estate. For example, they could be used as a form of payment for the purchase of a property, or as a means of transferring ownership from one person to another. Because cryptocurrencies are decentralized and secure, they could provide an alternative to traditional forms of payment, such as bank transfers or checks, and could make it easier to complete real estate transactions quickly and securely. However, the use of cryptocurrencies in property ownership is still a relatively new and emerging area, and their use in this context is not yet widespread. Try it out and log in as an owner with the following credentials: username: test@test.com, password: test.",
  },
];

const serviceList = [
  { className: "services", title: "Outer", href: "" },
  { className: "services", title: "product design", href: "" },
  { className: "services", title: "cryptocurrencies", href: "" },
  { className: "services", title: "user experience", href: "" },
  { className: "services", title: "nft implementation", href: "" },
  { className: "services", title: "marketplaces", href: "" },
  { className: "services", title: "web3", href: "" },
  { className: "services", title: "branding", href: "" },
];

const combinedObject = {
  services: serviceList,
  work: workList,
};

module.exports = async () => {
  // Simulate async operation (e.g., fetching from an API)
  return combinedObject;
};
