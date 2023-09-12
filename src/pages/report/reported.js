import { useEffect, useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ArticlesTable } from 'src/sections/report/articles-table';
import { ArticlesSearch } from 'src/sections/report/articles-search';
import { applyPagination } from 'src/utils/apply-pagination';

const useArticles = (page, rowsPerPage, data) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useArticleIds = (articles) => {
  return useMemo(
    () => {
      return articles.map((item) => item.id);
    },
    [articles]
  );
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const articles = useArticles(page, rowsPerPage, data);
  const articlesIds = useArticleIds(articles);
  const articleSelection = useSelection(articlesIds);
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );
  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8089/api/v1/admin/reported/articles');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const content = data.content;
      setData(content);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>
          Reported Articles
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Reported Articles
                </Typography>
              </Stack>
            </Stack>
            <ArticlesSearch />
            <ArticlesTable
              count={data.length}
              items={articles}
              onDeselectAll={articleSelection.handleDeselectAll}
              onDeselectOne={articleSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={articleSelection.handleSelectAll}
              onSelectOne={articleSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={articleSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
