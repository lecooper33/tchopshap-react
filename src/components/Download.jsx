import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { FaApple, FaGooglePlay } from "react-icons/fa";

function Download() {
  return (
    <Box
      sx={{ width: "95%",height: "100vh",display: "flex", marginLeft:'2.5%', py:5}}
    >
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#FFF7ED",
          padding: "60px 40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"sx={{ mb: 2, lineHeight: 1.3, width:'50%' }}>
          Téléchargez notre application
        </Typography>

        <Typography
          fontSize={14}
          color="text.secondary"
          sx={{ lineHeight: 1.8, mb: 3, maxWidth: "50%" }}
        >
          Commandez plus rapidement, suivez vos livraisons en temps réel et
          bénéficiez d'offres exclusives.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              '&:hover': { backgroundColor: "#222" },
            }}
          >
            <FaApple size={24} />
            <Box sx={{ textAlign: "left" }}>
              <Typography sx={{ fontSize: 10 }}>Télécharger sur</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                App Store
              </Typography>
            </Box>
          </Button>

          <Button
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,textTransform: "none",'&:hover': { backgroundColor: "#222" },}}>
            <FaGooglePlay size={24} />
            <Box sx={{ textAlign: "left" }}>
              <Typography sx={{ fontSize: 10 }}>Télécharger sur</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Google Play
              </Typography>
            </Box>
          </Button>
        </Box>
      </Box>

      <Box
        component="img"
        src="/Img/Container.png"
        alt="Tacos"
        sx={{
          width: "50%",
          height: "100%",
          objectFit: "cover",
          borderTopRightRadius:'5%',
          borderBottomRightRadius:'5%'
        }}
      />
    </Box>
  );
}

export default Download;
