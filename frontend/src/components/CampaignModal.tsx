import React, { useState } from 'react';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';


interface CampaignModalProps {
  open: boolean;
  handleClose: () => void;
  campaign?: {
    id: number;
    name: string;
    from: string;
    to: string;
    amount: number;
    currency: string;
    prefix: string;
  } | null;
  isCreate?: boolean;
  newCampaign?: {
    name: string;
    prefix: string;
    from: string;
    to: string;
    amount: number;
    currency: string;
  };
  setNewCampaign?: React.Dispatch<React.SetStateAction<{
    name: string;
    prefix: string;
    from: string;
    to: string;
    amount: number;
    currency: string;
  }>>;
  handleCreateCampaign?: () => void;
  fetchCampaigns?: () => void;
  snackbarMessage?: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CampaignModal: React.FC<CampaignModalProps> = ({
                                                       open,
                                                       handleClose,
                                                       campaign,
                                                       isCreate = false,
                                                       newCampaign,
                                                       setNewCampaign,
                                                       handleCreateCampaign,
                                                       fetchCampaigns,
                                                       snackbarMessage,
                                                       setSnackbarOpen,
                                                     }) => {
  const [voucherAmount, setVoucherAmount] = useState(0);

  const handleGenerateVouchers = async () => {
    if (!campaign || !fetchCampaigns || !snackbarMessage || !setSnackbarOpen) return;
    try {
      await axios.post(`/api/campaigns/${campaign.id}/vouchers`, { amount: voucherAmount });
      fetchCampaigns();
      snackbarMessage('Vouchers generated successfully');
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error('Failed to generate vouchers', error);
      snackbarMessage('Failed to generate vouchers');
      setSnackbarOpen(true);
    }
  };

  const handleDownloadVouchers = async () => {
    if (!campaign) return;
    try {
      const response = await axios.get(`/api/campaigns/${campaign.id}/vouchers/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vouchers-${campaign.prefix}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Failed to download vouchers', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setNewCampaign) return;
    setNewCampaign(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <div className="modal-header">
          <Typography variant="h6">{isCreate ? 'Create Campaign' : 'Campaign Details'}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {isCreate ? (
          <div className="modal-content">
            <TextField
              label="Name"
              name="name"
              value={newCampaign?.name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Prefix"
              name="prefix"
              value={newCampaign?.prefix || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="From"
              name="from"
              type="date"
              value={newCampaign?.from || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="To"
              name="to"
              type="date"
              value={newCampaign?.to || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={newCampaign?.amount || 0}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Currency"
              name="currency"
              value={newCampaign?.currency || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleCreateCampaign} fullWidth>
              Create
            </Button>
          </div>
        ) : (
          <div className="modal-content">
            <Typography>Name: {campaign?.name}</Typography>
            <Typography>Prefix: {campaign?.prefix}</Typography>
            <Typography>From: {new Date(campaign?.from ?? '').toLocaleDateString()}</Typography>
            <Typography>To: {new Date(campaign?.to ?? '').toLocaleDateString()}</Typography>
            <Typography>Amount: {campaign?.amount}</Typography>
            <Typography>Currency: {campaign?.currency}</Typography>
            <TextField
              label="Voucher Amount"
              type="number"
              value={voucherAmount}
              onChange={(e) => setVoucherAmount(Number(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleGenerateVouchers} fullWidth>
              Generate Vouchers
            </Button>
            <Button variant="contained" onClick={handleDownloadVouchers} fullWidth>
              Download Vouchers
            </Button>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default CampaignModal;
