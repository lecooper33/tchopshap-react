import React from "react";
import {Box, Container, Paper,TextField, Typography, Link,Checkbox, Button} from "@mui/material"
import { ArrowBack } from "@mui/icons-material";

export default function Facture(){
    return(

        <Container>
            <Box sx={{marginLeft:'49px', marginTop:'30px'}}>
              <Link href='/Cart' underline="none" color="inherit" sx={{ "&:hover": { textDecoration: "underline" } }}> 
         <Typography variant="h6" sx={{display:'flex', alignItems:'center'}}>
                <ArrowBack/> Retour
            </Typography></Link>  
            <Typography variant="h5" fontWeight={'bold'} sx={{marginTop:'10px',marginBottom:'10px'}}>Finaliser la commande</Typography>
            <Typography> Remplissez les informations ci-dessous pour finaliser votre commande</Typography>
            </Box>
        <Container sx={{alignItems:'center', display:'flex', flexDirection:'column', textAlign:'left'}}>
       
        <Box sx={{width: '95%', m: 2}}>
  <Paper>
    <Typography variant="h5" fontWeight={'bold'} sx={{p: 2}}>Informations de livraison</Typography>
    
    <Box sx={{px: 2, pb: 2}}>
      <Typography sx={{mb: 1}}>Nom complet</Typography>
      <TextField 
        fullWidth
        size="small"
        placeholder="Jean Dupont"
        sx={{mb: 2}}
      />
      
      <Box sx={{ width: '100%' }}>
  <Typography variant="body1" sx={{  mb: 1 }}>
    Adresse de livraison
  </Typography>
  <TextField
    fullWidth
    multiline
    rows={3}
    variant="outlined"
    placeholder="Adresse complète de livraison"
    sx={{'& .MuiOutlinedInput-root': {padding: '10px', alignItems: 'flex-start'}}}/>
</Box>
      
      <Typography sx={{mb: 1}}>Numéro de téléphone</Typography>
      <TextField
        fullWidth
        size="small" placeholder="Pour vous contacter en cas de besoin" sx={{mb: 2}}/>
      
      <Typography sx={{mb: 1}}>Instructions spéciales (optionnel)</Typography>
      <TextField
        fullWidth
        multiline
    rows={1.8}
        size="small" placeholder="Instructions pour la livraison ou la préparation" sx={{mb: 2}}/>
    </Box>
  </Paper>
</Box>
        <Box sx={{width:'95%'}}>
  <Paper sx={{marginBottom:'15px'}}>
    <Typography variant="h5" fontWeight={'bold'} sx={{p:2}}>Méthode de paiement</Typography>
    
    <Box sx={{display:'flex', alignItems:'center', gap:'7px', ml: 2, mb: 2}}>
      <Checkbox />
      <Typography>Carte bancaire</Typography>
    </Box> 
    
    <Typography sx={{ml: 2, mt: 2}}>Numéro de carte</Typography>
    <TextField 
      placeholder="1234 5678 9012 3456"  sx={{width:'97%', ml: 2}} size="small" />
    
    <Box display={'flex'} gap={2} mt={2} sx={{width: '97%', ml: 2}}>
      <Box sx={{flex: 1}}>
        <Typography >Date d'expiration</Typography>
        <TextField 
          placeholder="MM/AA"   sx={{width:'100%'}}
          size="small"/>
      </Box>
      <Box sx={{flex: 1}}>
        <Typography >CVV</Typography>
        <TextField 
          placeholder="123" 
          sx={{width:'100%'}}  size="small"/>
      </Box>
    </Box>
    

    
    <Box sx={{display:'flex', alignItems:'center', gap:'7px', ml: 2, mb: 1}}>
      <Checkbox />
      <Typography>Mobile Money</Typography>
    </Box>
    
    <Box sx={{display:'flex', alignItems:'center', gap:'7px', ml: 2, mb: 3}}>
      <Checkbox />
      <Typography>Espèces à la livraison</Typography>
    </Box>
    
    
    <Button 
      variant="contained" 
      sx={{ backgroundColor: 'orange',  color: 'white', 
        width: '97%', ml: 2, 
        mb: 2,  mt: 2,
        '&:hover': { backgroundColor: 'darkorange'  } }} >
      Confirmer la commande
    </Button>
  </Paper>
</Box>
            <Box sx={{width:'95%'}} marginBottom={5} marginTop={5}>
                <Paper>
                    <Typography variant="h5" fontWeight={'bold'} sx={{p:2}}> Récapitulatif</Typography>
                    <Box display={'flex'} width={'97%'} m={'auto'}>
                        <Typography flexGrow={1}> Sous-total</Typography>
                        <Typography>  2480 f</Typography>
                    </Box>
                    <Box display={'flex'} width={'97%'} m={'auto'} marginTop={2}>
                        <Typography flexGrow={1}> Sous-total</Typography>
                        <Typography> 299 f</Typography>
                    </Box>
                    <Box display={'flex'} width={'97%'} m={'auto'} borderTop={'2px solid black'} marginTop={2} > 
                        <Typography flexGrow={1} fontWeight={'bold'} marginTop={1}>Total</Typography>
                        <Typography fontWeight={'bold'} marginBottom={2}  marginTop={1}> 2779 f</Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
        </Container>

    )

}