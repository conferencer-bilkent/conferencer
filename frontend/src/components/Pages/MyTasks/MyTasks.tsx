import React from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";
import AppButton from "../../../components/global/AppButton";
import { RateReview, Edit } from "@mui/icons-material";

const menuItems = [
  "MY TASKS",
  "MY ROLES",
  "CONFERENCES",
  "NOTIFICATIONS",
  "CHATS",
  "SETTINGS",
  "PROFILE",
  "LOG OUT",
];

const MyTasks: React.FC = () => {
  const theme = useTheme();

  const handleItemClick = (item: string) => {
    console.log("Clicked:", item);
  };

  const unreviewedPapers = [
    {
      id: 1,
      authors: "Berkay Aycicek",
      title: "Computer Graphics",
      keywords: "Graphics, Ray, 3d",
      track: "Computer Science",
      date: "Dec 3, 17:00 GMT",
      paperLink: "paper-v1.pdf",
    },
    {
      id: 2,
      authors: "Berkay Aycicek, Atilla Soylemez",
      title: "Machine Learning",
      keywords: "Artificial, Intelligence, machine",
      track: "Machine Learning",
      date: "Dec 2, 17:00 GMT",
      paperLink: "paper2-v1.pdf",
    },
  ];

  const reviewedPapers = [
    {
      id: 1,
      authors: "Berkay Aycicek",
      title: "Computer Networks",
      keywords: "ethernet, link, network",
      track: "Computer Science",
      date: "Dec 3, 17:00",
      paperLink: "paper-v1.pdf",
      decision: "reject -1",
      review: "review-v1.txt",
      confidence: 3,
    },
  ];

  return (
    <>
      <Topbar />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideMenu items={menuItems} onItemClick={handleItemClick} />
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            padding: "2rem",
          }}
        >
          <Typography variant="h4" gutterBottom>
            My Tasks
          </Typography>

          {/* Unreviewed Papers */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Unreviewed Papers
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Authors</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Keywords</TableCell>
                    <TableCell>Track</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Paper</TableCell>
                    <TableCell>Decision</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unreviewedPapers.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell>{paper.id}</TableCell>
                      <TableCell>{paper.authors}</TableCell>
                      <TableCell>{paper.title}</TableCell>
                      <TableCell>{paper.keywords}</TableCell>
                      <TableCell>{paper.track}</TableCell>
                      <TableCell>{paper.date}</TableCell>
                      <TableCell>
                        <a href={`/${paper.paperLink}`}>{paper.paperLink}</a>
                      </TableCell>
                      <TableCell>
                        <AppButton
                          icon={<RateReview />}
                          text="Make Review"
                          onClick={() =>
                            console.log(`Making review for ${paper.id}`)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Reviewed Papers */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Reviewed Papers
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Authors</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Keywords</TableCell>
                    <TableCell>Track</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Paper</TableCell>
                    <TableCell>Decision</TableCell>
                    <TableCell>Review</TableCell>
                    <TableCell>Confidence</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewedPapers.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell>{paper.id}</TableCell>
                      <TableCell>{paper.authors}</TableCell>
                      <TableCell>{paper.title}</TableCell>
                      <TableCell>{paper.keywords}</TableCell>
                      <TableCell>{paper.track}</TableCell>
                      <TableCell>{paper.date}</TableCell>
                      <TableCell>
                        <a href={`/${paper.paperLink}`}>{paper.paperLink}</a>
                      </TableCell>
                      <TableCell>{paper.decision}</TableCell>
                      <TableCell>
                        <a href={`/${paper.review}`}>{paper.review}</a>
                      </TableCell>
                      <TableCell>{paper.confidence}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <AppButton
                            icon={<Edit />}
                            text="Update Review"
                            onClick={() =>
                              console.log(`Updating review ${paper.id}`)
                            }
                          />
                          <Button variant="contained" color="error">
                            Delete Review
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default MyTasks;
