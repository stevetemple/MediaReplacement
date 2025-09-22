using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Persistence.Querying;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.MediaReplacement.Services
{
	public class MediaFoldersOnlyFilteredEntityService : IFilteredEntityService
	{
		private readonly IEntityService _entityService;

		public MediaFoldersOnlyFilteredEntityService(IEntityService entityService)
		{
			_entityService = entityService;
		}

		public IEnumerable<IEntitySlim> GetPagedChildren(
			Guid? parentKey,
			UmbracoObjectTypes childObjectType,
			int skip,
			int take,
			out long totalRecords,
			IQuery<IUmbracoEntity>? filter = null,
			Ordering? ordering = null)
		{
			return
				_entityService
					.GetPagedChildren(parentKey, childObjectType, skip, take, out totalRecords, filter, ordering)
					.Where(FoldersOnlyFilter);
		}

		private bool FoldersOnlyFilter(IEntitySlim e) => e is IMediaEntitySlim && ((IMediaEntitySlim)e).ContentTypeKey == new Guid("f38bd2d7-65d0-48e6-95dc-87ce06ec2d3d"); // TODO : Don't hardcode

	}
}
