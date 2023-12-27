export const useLearningPlan = () => {
    const updateMeetings = async (schedules) => {
        meetings.value = (
          await find('learning-plan-meetings', {
            filters: {
              schedule: {
                id: {
                  $in: schedules.data.map((item) => item.id),
                },
              },
              isExpired: false,
            },
            populate: 'schedule',
            sort: 'date:asc',
          })
        ).data.splice(0, 2);
      };

    return {}
}