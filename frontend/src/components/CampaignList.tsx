import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Snackbar,
  TablePagination,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import CampaignModal from './CampaignModal';

interface Campaign {
  id: number;
  name: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  prefix: string;
  status: string;
}

interface CampaignResponse {
  items: Campaign[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', prefix: '', from: '', to: '', amount: 0, currency: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [meta, setMeta] = useState({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 2,
    totalPages: 0,
    currentPage: 0
  });

  useEffect(() => {
    fetchCampaigns();
  }, [page, rowsPerPage]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get<CampaignResponse>('/api/campaigns', {
        params: { page: page + 1, limit: rowsPerPage }
      });
      setCampaigns(response.data.items);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    }
  };

  const handleOpen = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCreateOpen = () => setCreateOpen(true);

  const handleCreateClose = () => setCreateOpen(false);

  const handleCreateCampaign = async () => {
    try {
      await axios.post('/api/campaigns', newCampaign);
      fetchCampaigns();
      setCreateOpen(false);
      setSnackbarMessage('Campaign created successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to create campaign', error);
      setSnackbarMessage('Failed to create campaign');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    try {
      await axios.delete(`/api/campaigns/${id}`);
      fetchCampaigns();
      setSnackbarMessage('Campaign deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to delete campaign', error);
      setSnackbarMessage('Failed to delete campaign');
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <Typography variant="h4" className="header">Campaign Manager</Typography>
          <Button variant="contained" className="create-button" onClick={handleCreateOpen}>
            Create Campaign
          </Button>
        </div>

        <TableContainer component={Paper} className="table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Prefix</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>{campaign.name}</TableCell>
                    <TableCell>{campaign.prefix}</TableCell>
                    <TableCell>{new Date(campaign.from).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(campaign.to).toLocaleDateString()}</TableCell>
                    <TableCell>{campaign.amount}</TableCell>
                    <TableCell>{campaign.currency}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleOpen(campaign)}>
                        Details
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDeleteCampaign(campaign.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No campaigns to display</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={meta.totalItems}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <CampaignModal
          open={open}
          handleClose={handleClose}
          campaign={currentCampaign}
          fetchCampaigns={fetchCampaigns}
          snackbarMessage={setSnackbarMessage}
          setSnackbarOpen={setSnackbarOpen}
        />

        <CampaignModal
          open={createOpen}
          handleClose={handleCreateClose}
          isCreate
          newCampaign={newCampaign}
          setNewCampaign={setNewCampaign}
          handleCreateCampaign={handleCreateCampaign}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    </div>
  );
};

export default CampaignList;
