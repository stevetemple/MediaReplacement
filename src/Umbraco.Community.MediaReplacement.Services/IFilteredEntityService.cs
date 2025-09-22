using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Persistence.Querying;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.MediaReplacement.Services
{
	public interface IFilteredEntityService
	{
		IEnumerable<IEntitySlim> GetPagedChildren(
			Guid? parentKey,
			UmbracoObjectTypes childObjectType,
			int skip,
			int take,
			out long totalRecords,
			IQuery<IUmbracoEntity>? filter = null,
			Ordering? ordering = null);
	}
}
