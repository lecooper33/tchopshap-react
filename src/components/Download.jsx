import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { FaApple, FaGooglePlay } from "react-icons/fa";

function Download() {
  return (
    <Box
      sx={{
        width: "95%",
        minHeight: "90vh",
        display: "flex", justifyContent:'center',
        margin:'auto',
        marginTop:'5%' ,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          
          width: { xs: "95%", md: "50%" },
          backgroundColor: "#FFF7ED",
          padding: { xs: "40px 11px", md: "60px 40px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 2, lineHeight: 1.3, width: { xs: "95%", sm: "80%", md: "50%" } }}
        >
          Téléchargez notre application
        </Typography>

        <Typography
          fontSize={14}
          color="text.secondary"
          sx={{
            lineHeight: 1.8,
            mb: 3,
            maxWidth: { xs: "100%", sm: "80%", md: "50%" },
          }}
        >
          Commandez plus rapidement, suivez vos livraisons en temps réel et
          bénéficiez d'offres exclusives.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
              gap: 1,
              textTransform: "none",
              '&:hover': { backgroundColor: "#222" },
            }}
          >
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
          width:  { xs: "100%", md: "50%" },
          height: { xs: "300px", sm: "400px", md: "100%" },
          objectFit: "cover",
          borderTopRightRadius: { xs: 0, md: "5%" },
          borderBottomRightRadius: { xs: 0, md: "5%" },
          borderBottomLeftRadius: { xs: "0", md: 0 }, 
        }}
      />
    </Box>
  );
}

export default Download;
