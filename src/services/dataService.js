import database from '../data/database.json';

// خدمة البيانات الرئيسية
class DataService {
  constructor() {
    this.data = database;
  }

  // الأنشطة
  getAllActivities() {
    return this.data.activities;
  }

  getActivityById(id) {
    return this.data.activities.find(activity => activity.id === parseInt(id));
  }

  getActivitiesByCategory(category) {
    return this.data.activities.filter(activity => 
      activity.category === category || activity.categoryEn === category
    );
  }

  getAvailableActivities() {
    return this.data.activities.filter(activity => 
      activity.status === 'متاح' || activity.statusEn === 'Available'
    );
  }

  // الأعضاء
  getAllMembers() {
    return this.data.members;
  }

  getMemberById(id) {
    return this.data.members.find(member => member.id === parseInt(id));
  }

  getActiveMembers() {
    return this.data.members.filter(member => 
      member.status === 'نشط' || member.statusEn === 'Active'
    );
  }

  getMembersByActivity(activityId) {
    return this.data.members.filter(member => 
      member.activities.includes(parseInt(activityId))
    );
  }

  // المدربين
  getAllTrainers() {
    return this.data.trainers;
  }

  getTrainerById(id) {
    return this.data.trainers.find(trainer => trainer.id === parseInt(id));
  }

  getTrainerByActivity(activityId) {
    return this.data.trainers.find(trainer => 
      trainer.activities.includes(parseInt(activityId))
    );
  }

  getActiveTrainers() {
    return this.data.trainers.filter(trainer => 
      trainer.status === 'نشط' || trainer.statusEn === 'Active'
    );
  }

  // الأحداث والفعاليات
  getAllEvents() {
    return this.data.events;
  }

  getEventById(id) {
    return this.data.events.find(event => event.id === parseInt(id));
  }

  getUpcomingEvents() {
    const today = new Date();
    return this.data.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getEventsByCategory(category) {
    return this.data.events.filter(event => 
      event.category === category || event.categoryEn === category
    );
  }

  getOpenEvents() {
    return this.data.events.filter(event => 
      event.status === 'مفتوح للتسجيل' || event.statusEn === 'Open for Registration'
    );
  }

  // الإعدادات
  getSettings() {
    return this.data.settings;
  }

  getContactInfo() {
    return this.data.settings.contact;
  }

  getSocialMedia() {
    return this.data.settings.socialMedia;
  }

  getWorkingHours() {
    return this.data.settings.workingHours;
  }

  // إحصائيات
  getStatistics() {
    return {
      totalActivities: this.data.activities.length,
      totalMembers: this.data.members.length,
      totalTrainers: this.data.trainers.length,
      totalEvents: this.data.events.length,
      activeMembers: this.getActiveMembers().length,
      availableActivities: this.getAvailableActivities().length,
      upcomingEvents: this.getUpcomingEvents().length
    };
  }

  // البحث
  searchActivities(query) {
    const searchTerm = query.toLowerCase();
    return this.data.activities.filter(activity => 
      activity.name.toLowerCase().includes(searchTerm) ||
      activity.nameEn.toLowerCase().includes(searchTerm) ||
      activity.description.toLowerCase().includes(searchTerm) ||
      activity.descriptionEn.toLowerCase().includes(searchTerm) ||
      activity.category.toLowerCase().includes(searchTerm) ||
      activity.categoryEn.toLowerCase().includes(searchTerm)
    );
  }

  searchMembers(query) {
    const searchTerm = query.toLowerCase();
    return this.data.members.filter(member => 
      member.name.toLowerCase().includes(searchTerm) ||
      member.nameEn.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm)
    );
  }

  searchTrainers(query) {
    const searchTerm = query.toLowerCase();
    return this.data.trainers.filter(trainer => 
      trainer.name.toLowerCase().includes(searchTerm) ||
      trainer.nameEn.toLowerCase().includes(searchTerm) ||
      trainer.specialization.toLowerCase().includes(searchTerm) ||
      trainer.specializationEn.toLowerCase().includes(searchTerm)
    );
  }

  searchEvents(query) {
    const searchTerm = query.toLowerCase();
    return this.data.events.filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      event.titleEn.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.descriptionEn.toLowerCase().includes(searchTerm)
    );
  }

  // تصفية متقدمة
  filterActivities(filters) {
    let filtered = this.data.activities;

    if (filters.category) {
      filtered = filtered.filter(activity => 
        activity.category === filters.category || activity.categoryEn === filters.category
      );
    }

    if (filters.ageGroup) {
      filtered = filtered.filter(activity => activity.ageGroup === filters.ageGroup);
    }

    if (filters.trainer) {
      filtered = filtered.filter(activity => 
        activity.trainer === filters.trainer || activity.trainerEn === filters.trainer
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(activity => 
        activity.price >= filters.priceRange.min && activity.price <= filters.priceRange.max
      );
    }

    if (filters.status) {
      filtered = filtered.filter(activity => 
        activity.status === filters.status || activity.statusEn === filters.status
      );
    }

    return filtered;
  }
}

// إنشاء مثيل واحد من الخدمة
const dataService = new DataService();

export default dataService;

// تصدير الفئات المختلفة للاستخدام المباشر
export const {
  getAllActivities,
  getActivityById,
  getActivitiesByCategory,
  getAvailableActivities,
  getAllMembers,
  getMemberById,
  getActiveMembers,
  getMembersByActivity,
  getAllTrainers,
  getTrainerById,
  getTrainerByActivity,
  getActiveTrainers,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  getEventsByCategory,
  getOpenEvents,
  getSettings,
  getContactInfo,
  getSocialMedia,
  getWorkingHours,
  getStatistics,
  searchActivities,
  searchMembers,
  searchTrainers,
  searchEvents,
  filterActivities
} = dataService;